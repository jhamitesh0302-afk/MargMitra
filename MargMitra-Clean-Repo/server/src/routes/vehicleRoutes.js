const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/my', verifyToken, requireRole('TRANSPORTER', 'ADMIN'), vehicleController.getMyVehicles);
router.post('/', verifyToken, requireRole('TRANSPORTER', 'ADMIN'), vehicleController.createVehicle);

module.exports = router;
