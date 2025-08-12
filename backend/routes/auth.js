const express = require('express');
const { auth } = require('../middleware/auth');
const controller = require('../controllers/authController');
const router = express.Router();
console.log('[ROUTE] /api/auth loaded');

router.post('/register', controller.register);
router.post('/verify-otp', controller.verifyOtp);
router.post('/login', controller.login);
router.get('/me', auth, (req, res) => res.json({ user: {
  id: req.user._id,
  email: req.user.email,
  fullName: req.user.fullName,
  role: req.user.role,
  avatar: req.user.avatar,
  phone: req.user.phone,
  preferences: req.user.preferences
}}));

module.exports = router;