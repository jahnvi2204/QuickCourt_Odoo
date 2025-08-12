const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const controller = require('../controllers/adminController');
const router = express.Router();
console.log('[ROUTE] /api/admin loaded');

router.get('/analytics', auth, authorize('admin'), controller.analytics);
router.patch('/facilities/:id/approve', auth, authorize('admin'), controller.approveFacility);
router.get('/users', auth, authorize('admin'), controller.listUsers);
router.patch('/users/:id/status', auth, authorize('admin'), controller.updateUserStatus);

module.exports = router;

