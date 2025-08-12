const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  provider: {
    type: String,
    enum: ['stripe'],
    default: 'stripe'
  },
  status: {
    type: String,
    enum: ['created', 'processing', 'succeeded', 'failed', 'refunded'],
    default: 'created'
  },
  paymentIntentId: String,
  chargeId: String,
  method: {
    brand: String,
    last4: String,
  },
  failureReason: String
}, {
  timestamps: true
});

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ booking: 1 });

module.exports = mongoose.model('Payment', paymentSchema);


