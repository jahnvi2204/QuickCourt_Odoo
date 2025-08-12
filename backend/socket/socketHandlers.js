const socketAuth = require('./socketAuth');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

const setupSocketHandlers = (io) => {
  // Authentication middleware for socket connections
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);
    
    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);
    
    // Join facility owners to their facility rooms
    if (socket.userRole === 'facility_owner') {
      // Get user's facilities and join those rooms
      socket.on('join_facility_rooms', async (facilityIds) => {
        facilityIds.forEach(id => {
          socket.join(`facility_${id}`);
        });
      });
    }

    // Handle booking status updates
    socket.on('booking_update', async (data) => {
      try {
        const { bookingId, status, reason } = data;
        
        const booking = await Booking.findById(bookingId)
          .populate('user', 'fullName email')
          .populate('facility', 'name owner');

        if (!booking) {
          socket.emit('error', { message: 'Booking not found' });
          return;
        }

        // Check permissions
        if (socket.userRole === 'facility_owner' && 
            booking.facility.owner.toString() !== socket.userId) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        // Update booking
        booking.status = status;
        if (reason) booking.statusReason = reason;
        await booking.save();

        // Notify relevant parties
        const notification = {
          type: 'booking_update',
          title: `Booking ${status}`,
          message: `Your booking at ${booking.facility.name} has been ${status}`,
          data: { bookingId: booking._id }
        };

        // Notify user
        io.to(`user_${booking.user._id}`).emit('notification', notification);
        
        // Notify facility owner if update was made by admin
        if (socket.userRole === 'admin') {
          io.to(`user_${booking.facility.owner}`).emit('notification', {
            ...notification,
            message: `Booking at your facility has been ${status} by admin`
          });
        }

        socket.emit('booking_updated', booking);
      } catch (error) {
        socket.emit('error', { message: 'Failed to update booking' });
      }
    });

    // Handle new booking notifications
    socket.on('new_booking', async (bookingData) => {
      try {
        // Notify facility owner of new booking
        const booking = await Booking.findById(bookingData.bookingId)
          .populate('user', 'fullName')
          .populate('facility', 'name owner');

        const notification = {
          type: 'new_booking',
          title: 'New Booking Received',
          message: `${booking.user.fullName} booked ${booking.court.name}`,
          data: { bookingId: booking._id }
        };

        io.to(`user_${booking.facility.owner}`).emit('notification', notification);
      } catch (error) {
        console.error('Error handling new booking notification:', error);
      }
    });

    // Handle real-time availability updates
    socket.on('check_availability', async (data) => {
      try {
        const { facilityId, courtId, date } = data;
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await Booking.find({
          facility: facilityId,
          'court._id': courtId,
          date: { $gte: startOfDay, $lte: endOfDay },
          status: { $in: ['confirmed', 'pending'] }
        });

        socket.emit('availability_data', { bookings });
      } catch (error) {
        socket.emit('error', { message: 'Failed to check availability' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

module.exports = setupSocketHandlers;