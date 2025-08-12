const express = require('express');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/bookingController');
const router = express.Router();
console.log('[ROUTE] /api/bookings loaded');

router.post('/', auth, controller.create);
router.get('/my-bookings', auth, controller.myBookings);
router.patch('/:id/status', auth, controller.updateStatus);

module.exports = router;