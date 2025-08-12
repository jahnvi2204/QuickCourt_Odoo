const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = async () => {
  const users = [
    { email: 'admin@quickcourt.test', password: await bcrypt.hash('password123', 12), fullName: 'Admin User', role: 'admin', isVerified: true },
    { email: 'owner@quickcourt.test', password: await bcrypt.hash('password123', 12), fullName: 'Owner User', role: 'facility_owner', isVerified: true },
    { email: 'user@quickcourt.test', password: await bcrypt.hash('password123', 12), fullName: 'Regular User', role: 'user', isVerified: true },
  ];

  await User.deleteMany({ email: { $in: users.map(u => u.email) } });
  await User.insertMany(users);
};


