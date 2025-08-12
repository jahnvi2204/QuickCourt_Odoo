const User = require('../models/User');
const { updateProfileSchema } = require('../utils/validators');

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateMe = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const user = await User.findByIdAndUpdate(req.user._id, value, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


