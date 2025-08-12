const User = require('../models/User');
const Facility = require('../models/Facility');
const Booking = require('../models/Booking');

exports.analytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate && endDate) dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const [totalUsers, totalFacilities, totalBookings, revenueData, userGrowth, bookingTrends, topFacilities] = await Promise.all([
      User.countDocuments({ ...dateFilter }),
      Facility.countDocuments({ ...dateFilter }),
      Booking.countDocuments({ ...dateFilter }),
      Booking.aggregate([{ $match: { ...dateFilter, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      User.aggregate([{ $match: dateFilter }, { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }]),
      Booking.aggregate([{ $match: dateFilter }, { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }, { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }]),
      Booking.aggregate([{ $match: { ...dateFilter, status: { $in: ['confirmed', 'completed'] } } }, { $group: { _id: '$facility', bookings: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }, { $sort: { revenue: -1 } }, { $limit: 10 }, { $lookup: { from: 'facilities', localField: '_id', foreignField: '_id', as: 'facility' } }])
    ]);

    res.json({
      summary: { totalUsers, totalFacilities, totalBookings, totalRevenue: revenueData[0]?.total || 0 },
      trends: { userGrowth, bookingTrends },
      topFacilities
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.approveFacility = async (req, res) => {
  try {
    const { approved, reason } = req.body;
    const facility = await Facility.findByIdAndUpdate(req.params.id, { isApproved: approved, ...(reason && { approvalNotes: reason }) }, { new: true }).populate('owner', 'fullName email');
    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    const query = {};
    if (search) query.$or = [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.json({ users, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive, reason } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive, ...(reason && { statusReason: reason }) }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


