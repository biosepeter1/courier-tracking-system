const express = require('express');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validate, createShipmentSchema, updateShipmentSchema } = require('../middleware/validation');
const {
  createShipment,
  getShipments,
  getShipmentById,
  getShipmentByTrackingNumber,
  updateShipment,
  updateShipmentDetails,
  deleteShipment,
  getShipmentStats
} = require('../controllers/shipmentController');

const router = express.Router();

// Public routes (no authentication required)
router.get('/tracking/:trackingNumber', getShipmentByTrackingNumber);

// Protected routes (authentication required)
router.use(authenticateToken);

// User and Admin routes
router.get('/', getShipments); // Users see their shipments, admins see all
router.get('/:id', getShipmentById);

// User and Admin routes - users can create, admin required for other actions
router.post('/', validate(createShipmentSchema), createShipment);
router.put('/:id/update', requireAdmin, validate(updateShipmentSchema), updateShipment);
router.put('/:id/details', requireAdmin, updateShipmentDetails);
router.delete('/:id', requireAdmin, deleteShipment);
router.get('/admin/stats', requireAdmin, getShipmentStats);

module.exports = router;