const express = require('express');
const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

const router = express.Router();
console.log('[ROUTE] /api/payments loaded');

router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('facility user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: 'usd',
      metadata: { bookingId: booking._id.toString(), facilityName: booking.facility.name, userEmail: booking.user.email }
    });

    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      currency: 'usd',
      provider: 'stripe',
      status: 'created',
      paymentIntentId: intent.id
    });

    res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id, paymentId: payment._id });
  } catch (error) {
    res.status(500).json({ message: 'Payment setup failed', error: error.message });
  }
});

router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') return res.status(400).json({ message: 'Payment not completed' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.paymentId = paymentIntentId;
    await booking.save();

    await Payment.findOneAndUpdate({ paymentIntentId }, { status: 'succeeded', chargeId: intent.latest_charge }, { new: true });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed', error: error.message });
  }
});

module.exports = router;