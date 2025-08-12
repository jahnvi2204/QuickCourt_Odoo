const Facility = require('../models/Facility');
const Booking = require('../models/Booking');

exports.list = async (req, res) => {
  try {
    const { search, sportType, city, minPrice, maxPrice, rating, page = 1, limit = 12, sortBy = 'rating.average', sortOrder = 'desc' } = req.query;
    const query = { isApproved: true, isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }
    if (sportType) query.sportTypes = { $in: [sportType] };
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (minPrice || maxPrice) {
      query['courts.pricePerHour'] = {};
      if (minPrice) query['courts.pricePerHour'].$gte = Number(minPrice);
      if (maxPrice) query['courts.pricePerHour'].$lte = Number(maxPrice);
    }
    if (rating) query['rating.average'] = { $gte: Number(rating) };
    const sort = {}; sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const facilities = await Facility.find(query).populate('owner', 'fullName email').sort(sort).limit(limit * 1).skip((page - 1) * limit).exec();
    const total = await Facility.countDocuments(query);
    res.json({ facilities, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id).populate('owner', 'fullName email phone');
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const facilityData = { ...req.body, owner: req.user._id };
    const facility = new Facility(facilityData);
    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    if (req.user.role !== 'admin' && facility.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    const updated = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.availability = async (req, res) => {
  try {
    const { date, courtId } = req.query;
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
    const bookingQuery = { facility: req.params.id, date: { $gte: startOfDay, $lte: endOfDay }, status: { $in: ['confirmed', 'pending'] } };
    if (courtId) bookingQuery['court._id'] = courtId;
    const bookings = await Booking.find(bookingQuery);
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


