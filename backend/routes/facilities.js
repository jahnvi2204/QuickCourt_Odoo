const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const controller = require('../controllers/facilityController');
const router = express.Router();
console.log('[ROUTE] /api/facilities loaded');

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', auth, authorize('facility_owner', 'admin'), controller.create);
router.put('/:id', auth, authorize('facility_owner', 'admin'), controller.update);
router.get('/:id/availability', controller.availability);

module.exports = router;