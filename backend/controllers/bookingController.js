const Booking = require('../models/Booking');
const Facility = require('../models/Facility');

exports.create = async (req, res) => {
  try {
    const { facilityId, courtId, date, startTime, endTime, duration } = req.body;
    const facility = await Facility.findById(facilityId);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    const court = facility.courts.id(courtId);
    if (!court) return res.status(404).json({ message: 'Court not found' });

    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(bookingDate.setHours(23, 59, 59, 999));

    const conflict = await Booking.findOne({
      facility: facilityId,
      'court._id': courtId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['confirmed', 'pending'] },
      $or: [{ $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] }]
    });
    if (conflict) return res.status(400).json({ message: 'Time slot not available' });

    const totalAmount = court.pricePerHour * duration;

    const booking = await Booking.create({
      user: req.user._id,
      facility: facilityId,
      court: { _id: court._id, name: court.name, sportType: court.sportType },
      date: bookingDate,
      startTime,
      endTime,
      duration,
      totalAmount
    });

    await booking.populate('facility', 'name address');
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;
    const bookings = await Booking.find(query).populate('facility', 'name address photos').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await Booking.countDocuments(query);
    res.json({ bookings, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    booking.status = status;
    if (status === 'cancelled') {
      booking.cancellationReason = cancellationReason;
      booking.cancelledAt = new Date();
      booking.cancelledBy = req.user._id;
    }
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


