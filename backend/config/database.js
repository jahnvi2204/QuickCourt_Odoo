const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017/quickcourt';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection error', { error: error.message });
    process.exit(1);
  }
};

module.exports = connectDatabase;


