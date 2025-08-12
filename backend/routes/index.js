const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const facilityRoutes = require('./facilities');
const bookingRoutes = require('./bookings');
const adminRoutes = require('./admin');
const uploadRoutes = require('./upload');
const paymentRoutes = require('./payments');
const notificationRoutes = require('./notifications');

const router = express.Router();
console.log('[ROUTE] /api router loaded');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/facilities', facilityRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;


