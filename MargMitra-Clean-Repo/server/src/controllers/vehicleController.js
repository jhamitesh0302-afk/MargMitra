const dataStore = require('../services/dataStore');

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await dataStore.getVehicles(req.user.id);
    return res.status(200).json({ success: true, count: vehicles.length, vehicles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const { vehicleType, registrationNo, model, maxCapacityKg } = req.body;

    if (!registrationNo || !maxCapacityKg) {
      return res.status(400).json({
        success: false,
        message: 'Registration number and max capacity in kg are required.'
      });
    }

    const vehicle = await dataStore.createVehicle({
      ownerId: req.user.id,
      vehicleType: vehicleType || 'PICKUP',
      registrationNo,
      model: model || '',
      maxCapacityKg: Number(maxCapacityKg)
    });

    return res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      vehicle
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
