// Haversine formula to compute great-circle distance in kilometers between two geo coordinates
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Matches trips for a given shipment request
 * @param {Object} shipment - The shipment request
 * @param {Array} trips - List of available trips
 * @returns {Array} - Ranked list of matching trips with score and savings calculation
 */
function findMatchingTripsForShipment(shipment, trips) {
  const matches = [];

  for (const trip of trips) {
    if (trip.status !== 'PLANNED') continue;
    if (trip.availableCapacityKg < shipment.weightKg) continue;

    // Proximity from Trip Origin to Shipment Pickup
    const pickupDistKm = haversineDistanceKm(
      trip.originLat,
      trip.originLng,
      shipment.pickupLat,
      shipment.pickupLng
    );

    // Proximity from Trip Destination to Shipment Dropoff
    const dropoffDistKm = haversineDistanceKm(
      trip.destinationLat,
      trip.destinationLng,
      shipment.dropoffLat,
      shipment.dropoffLng
    );

    // Pickup & Dropoff must be reasonably near the trip's endpoints or along corridor
    // Max allowable pickup deviation: 35 km, dropoff deviation: 35 km
    if (pickupDistKm > 40 || dropoffDistKm > 40) continue;

    // Total direct distance of shipment
    const shipmentDistanceKm = haversineDistanceKm(
      shipment.pickupLat,
      shipment.pickupLng,
      shipment.dropoffLat,
      shipment.dropoffLng
    );

    // Calculate estimated shared cost
    // Baseline dedicated vehicle cost in rural India: ~₹18/km + base ₹500
    const dedicatedSoloCost = Math.round(500 + shipmentDistanceKm * 18);

    // Shared rate: based on weight and distance with rural shared pool pricing
    const effectiveRate = trip.ratePerKgKm || 0.008;
    const sharedPrice = Math.round(
      Math.max(
        300,
        shipment.weightKg * shipmentDistanceKm * effectiveRate +
          pickupDistKm * 8 +
          dropoffDistKm * 8
      )
    );

    const savingsAmount = Math.max(0, dedicatedSoloCost - sharedPrice);
    const savingsPercent = Math.round((savingsAmount / dedicatedSoloCost) * 100);

    // Calculate matching score (0 to 100)
    // Factors: proximity (50%), capacity fit (25%), date match (25%)
    const proximityScore = Math.max(
      0,
      100 - (pickupDistKm + dropoffDistKm) * 1.2
    );
    const capacityRatio = shipment.weightKg / trip.availableCapacityKg;
    const capacityScore = Math.min(100, Math.round(capacityRatio * 100));

    const totalScore = Math.min(
      99,
      Math.round(proximityScore * 0.6 + capacityScore * 0.4)
    );

    matches.push({
      trip,
      matchScore: totalScore,
      pickupDeviationKm: Math.round(pickupDistKm * 10) / 10,
      dropoffDeviationKm: Math.round(dropoffDistKm * 10) / 10,
      shipmentDistanceKm: Math.round(shipmentDistanceKm * 10) / 10,
      estimatedSharedPrice: sharedPrice,
      estimatedSoloCost: dedicatedSoloCost,
      savingsAmount,
      savingsPercent
    });
  }

  // Sort by match score descending
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Matches pending shipments along a transporter's route to maximize fill-rate
 * @param {Object} trip - Transporter's scheduled trip
 * @param {Array} shipments - List of pending shipments
 * @returns {Array} - Ranked list of potential cargo pickups
 */
function findShipmentsForTrip(trip, shipments) {
  const matches = [];

  for (const shipment of shipments) {
    if (shipment.status !== 'PENDING') continue;
    if (shipment.weightKg > trip.availableCapacityKg) continue;

    const pickupDistKm = haversineDistanceKm(
      trip.originLat,
      trip.originLng,
      shipment.pickupLat,
      shipment.pickupLng
    );

    const dropoffDistKm = haversineDistanceKm(
      trip.destinationLat,
      trip.destinationLng,
      shipment.dropoffLat,
      shipment.dropoffLng
    );

    if (pickupDistKm > 40 || dropoffDistKm > 40) continue;

    const shipmentDist = haversineDistanceKm(
      shipment.pickupLat,
      shipment.pickupLng,
      shipment.dropoffLat,
      shipment.dropoffLng
    );

    const proposedEarnings = Math.round(
      Math.max(
        250,
        shipment.weightKg * shipmentDist * (trip.ratePerKgKm || 0.04) * 1.1 +
          pickupDistKm * 6 +
          dropoffDistKm * 6
      )
    );

    matches.push({
      shipment,
      pickupDeviationKm: Math.round(pickupDistKm * 10) / 10,
      dropoffDeviationKm: Math.round(dropoffDistKm * 10) / 10,
      proposedEarnings,
      additionalFillPercent: Math.round(
        (shipment.weightKg / trip.totalCapacityKg) * 100
      )
    });
  }

  return matches.sort((a, b) => b.proposedEarnings - a.proposedEarnings);
}

module.exports = {
  haversineDistanceKm,
  findMatchingTripsForShipment,
  findShipmentsForTrip
};
