const dataStore = require('../services/dataStore');
const { findMatchingTripsForShipment } = require('../services/matchingService');

exports.getAllShipments = async (req, res) => {
  try {
    const { status, entrepreneurId } = req.query;
    const shipments = await dataStore.getShipments({ status, entrepreneurId });
    return res.status(200).json({ success: true, count: shipments.length, shipments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await dataStore.getShipmentById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }
    return res.status(200).json({ success: true, shipment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyShipments = async (req, res) => {
  try {
    const shipments = await dataStore.getShipments({ entrepreneurId: req.user.id });
    return res.status(200).json({ success: true, count: shipments.length, shipments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const {
      title,
      cargoType,
      weightKg,
      volumeCft,
      pickupLocation,
      pickupLat,
      pickupLng,
      dropoffLocation,
      dropoffLat,
      dropoffLng,
      pickupDate,
      maxBudget,
      specialInstructions
    } = req.body;

    if (!title || !weightKg || !pickupLocation || !dropoffLocation || !pickupDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, weight, pickup location, dropoff location, and pickup date are required.'
      });
    }

    const newShipment = await dataStore.createShipment({
      entrepreneurId: req.user.id,
      title,
      cargoType: cargoType || 'GENERAL_GOODS',
      weightKg: Number(weightKg),
      volumeCft: volumeCft ? Number(volumeCft) : null,
      pickupLocation,
      pickupLat: Number(pickupLat) || 20.0812,
      pickupLng: Number(pickupLng) || 74.1082,
      dropoffLocation,
      dropoffLat: Number(dropoffLat) || 19.0735,
      dropoffLng: Number(dropoffLng) || 73.0045,
      pickupDate: new Date(pickupDate).toISOString(),
      maxBudget: maxBudget ? Number(maxBudget) : null,
      specialInstructions: specialInstructions || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Shipment request created successfully',
      shipment: newShipment
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMatchingTrips = async (req, res) => {
  try {
    const shipment = await dataStore.getShipmentById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const allTrips = await dataStore.getTrips({ status: 'PLANNED' });
    const matches = findMatchingTripsForShipment(shipment, allTrips);

    return res.status(200).json({
      success: true,
      shipmentId: shipment.id,
      count: matches.length,
      matches
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
