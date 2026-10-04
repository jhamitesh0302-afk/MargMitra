const dataStore = require('../services/dataStore');
const { findShipmentsForTrip } = require('../services/matchingService');

exports.getAllTrips = async (req, res) => {
  try {
    const { status, minCapacity, transporterId } = req.query;
    const trips = await dataStore.getTrips({ status, minCapacity, transporterId });
    return res.status(200).json({ success: true, count: trips.length, trips });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await dataStore.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    return res.status(200).json({ success: true, trip });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyTrips = async (req, res) => {
  try {
    const trips = await dataStore.getTrips({ transporterId: req.user.id });
    return res.status(200).json({ success: true, count: trips.length, trips });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const {
      vehicleId,
      originName,
      originLat,
      originLng,
      destinationName,
      destinationLat,
      destinationLng,
      departureTime,
      estimatedArrivalTime,
      totalCapacityKg,
      ratePerKgKm,
      flatRate,
      notes
    } = req.body;

    if (!originName || !destinationName || !departureTime || !totalCapacityKg) {
      return res.status(400).json({
        success: false,
        message: 'Origin, destination, departure time, and capacity are required.'
      });
    }

    const newTrip = await dataStore.createTrip({
      transporterId: req.user.id,
      vehicleId: vehicleId || 'veh-1',
      originName,
      originLat: Number(originLat) || 19.9975,
      originLng: Number(originLng) || 73.7898,
      destinationName,
      destinationLat: Number(destinationLat) || 19.076,
      destinationLng: Number(destinationLng) || 72.8777,
      departureTime: new Date(departureTime).toISOString(),
      estimatedArrivalTime: estimatedArrivalTime ? new Date(estimatedArrivalTime).toISOString() : null,
      totalCapacityKg: Number(totalCapacityKg),
      availableCapacityKg: Number(totalCapacityKg),
      ratePerKgKm: Number(ratePerKgKm) || 0.04,
      flatRate: flatRate ? Number(flatRate) : null,
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Trip scheduled successfully',
      trip: newTrip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['PLANNED', 'ON_THE_WAY', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const trip = await dataStore.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    if (trip.transporterId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this trip' });
    }

    const updated = await dataStore.updateTrip(req.params.id, { status });
    return res.status(200).json({ success: true, message: 'Trip status updated', trip: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMatchingShipments = async (req, res) => {
  try {
    const trip = await dataStore.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const allShipments = await dataStore.getShipments({ status: 'PENDING' });
    const matches = findShipmentsForTrip(trip, allShipments);

    return res.status(200).json({
      success: true,
      tripId: trip.id,
      count: matches.length,
      matches
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
