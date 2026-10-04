const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', tripController.getAllTrips);
router.get('/my', verifyToken, requireRole('TRANSPORTER', 'ADMIN'), tripController.getMyTrips);
router.get('/:id', tripController.getTripById);
router.post('/', verifyToken, requireRole('TRANSPORTER', 'ADMIN'), tripController.createTrip);
router.patch('/:id/status', verifyToken, tripController.updateTripStatus);
router.get('/:id/matching-shipments', verifyToken, tripController.getMatchingShipments);

module.exports = router;
