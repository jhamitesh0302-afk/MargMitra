const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', shipmentController.getAllShipments);
router.get('/my', verifyToken, requireRole('ENTREPRENEUR', 'ADMIN'), shipmentController.getMyShipments);
router.get('/:id', shipmentController.getShipmentById);
router.post('/', verifyToken, requireRole('ENTREPRENEUR', 'ADMIN'), shipmentController.createShipment);
router.get('/:id/matching-trips', shipmentController.getMatchingTrips);

module.exports = router;
