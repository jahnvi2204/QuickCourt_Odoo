const Booking = require('../models/Booking');
const Facility = require('../models/Facility');
const User = require('../models/User');

module.exports = async () => {
  const user = await User.findOne({ role: 'user' });
  const facility = await Facility.findOne();
  if (!user || !facility) return;

  const court = facility.courts[0];
  const today = new Date();

  const bookings = [
    {
      user: user._id,
      facility: facility._id,
      court: { _id: court._id, name: court.name, sportType: court.sportType },
      date: today,
      startTime: '10:00',
      endTime: '11:00',
      duration: 1,
      totalAmount: court.pricePerHour,
      status: 'confirmed',
      paymentStatus: 'paid'
    }
  ];

  await Booking.deleteMany({ user: user._id });
  await Booking.insertMany(bookings);
};


