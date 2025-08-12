const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../utils/validators');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({ ...value, otpCode, otpExpiry });

    res.status(201).json({ message: 'User registered. Verify OTP.', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otpCode } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otpCode !== otpCode || user.otpExpiry < new Date()) return res.status(400).json({ message: 'Invalid or expired OTP' });
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const user = await User.findOne({ email: value.email });
    if (!user || !await user.comparePassword(value.password)) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });
    if (!user.isActive) return res.status(400).json({ message: 'Account has been deactivated' });
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


