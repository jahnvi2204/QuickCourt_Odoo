// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const facilityRoutes = require('./routes/facilities');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Global process error handlers for better diagnostics
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt';
console.log('[BOOT] Connecting to MongoDB:', mongoUri.replace(/:\\?([^@/]+)@/, ':****@'));
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('[DB] MongoDB connected'))
.catch(err => console.log('[DB] MongoDB connection error:', err));

mongoose.connection.on('connected', () => console.log('[DB] connected event'));
mongoose.connection.on('error', (err) => console.error('[DB] error event:', err));
mongoose.connection.on('disconnected', () => console.warn('[DB] disconnected event'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Utility to extract routes from routers we mounted
const extractRoutes = (router, basePath) => {
  const collected = [];
  if (!router || !router.stack) return collected;
  router.stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const routePath = `${basePath}${layer.route.path}`;
      const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase());
      methods.forEach((method) => collected.push({ method, path: routePath }));
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      collected.push(...extractRoutes(layer.handle, basePath));
    }
  });
  return collected;
};

app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}`;
  console.log(`\n[BOOT] QuickCourt backend running at: ${baseUrl}`);

  const mountedRouters = [
    { base: '/api/auth', router: authRoutes },
    { base: '/api/users', router: userRoutes },
    { base: '/api/facilities', router: facilityRoutes },
    { base: '/api/bookings', router: bookingRoutes },
    { base: '/api/admin', router: adminRoutes },
    { base: '/api/upload', router: uploadRoutes },
    { base: '/api/payments', router: paymentRoutes },
    { base: '/api/notifications', router: notificationRoutes },
  ];

  const endpoints = mountedRouters.flatMap(({ base, router }) => extractRoutes(router, base));

  if (endpoints.length) {
    console.log('\nAvailable API endpoints:');
    endpoints
      .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))
      .forEach(({ method, path }) => console.log(`- ${method.padEnd(6)} ${baseUrl}${path}`));
  }
  console.log();
});
