const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetFacility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
  type: { type: String, enum: ['user', 'facility', 'system'], required: true },
  reason: { type: String, required: true },
  details: String,
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'dismissed'], default: 'open' },
  resolvedAt: Date,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);


