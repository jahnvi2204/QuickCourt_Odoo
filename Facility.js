const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sportType: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  amenities: [String],
  operatingHours: {
    monday: { start: String, end: String, closed: Boolean },
    tuesday: { start: String, end: String, closed: Boolean },
    wednesday: { start: String, end: String, closed: Boolean },
    thursday: { start: String, end: String, closed: Boolean },
    friday: { start: String, end: String, closed: Boolean },
    saturday: { start: String, end: String, closed: Boolean },
    sunday: { start: String, end: String, closed: Boolean }
  }
});

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  photos: [String],
  courts: [courtSchema],
  amenities: [String],
  sportTypes: [String],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  policies: {
    cancellation: String,
    payment: String,
    rules: [String]
  }
}, {
  timestamps: true
});

facilitySchema.index({ 'address.coordinates': '2dsphere' });
facilitySchema.index({ sportTypes: 1 });
facilitySchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Facility', facilitySchema);