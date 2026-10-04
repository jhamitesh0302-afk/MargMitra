const dataStore = require('../services/dataStore');

exports.createBooking = async (req, res) => {
  try {
    const { tripId, shipmentId, bookedWeightKg, agreedPrice } = req.body;

    if (!tripId || !shipmentId || !bookedWeightKg) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID, Shipment ID, and booked weight are required.'
      });
    }

    const trip = await dataStore.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const shipment = await dataStore.getShipmentById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (trip.availableCapacityKg < Number(bookedWeightKg)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient capacity. Available: ${trip.availableCapacityKg} kg`
      });
    }

    // Associate booking with the shipment owner (entrepreneur) regardless of who initiated the match
    const requesterId = shipment.entrepreneurId || req.user.id;

    const booking = await dataStore.createBooking({
      tripId,
      shipmentId,
      requesterId,
      bookedWeightKg: Number(bookedWeightKg),
      agreedPrice: Number(agreedPrice) || Math.round(bookedWeightKg * 3.5)
    });

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully. Otps generated for secure cargo handover.',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const allBookings = await dataStore.getBookings();
    const userBookings = allBookings.filter((b) => {
      if (req.user.role === 'TRANSPORTER') {
        return (b.trip && b.trip.transporterId === req.user.id) || b.requesterId === req.user.id;
      }
      return b.requesterId === req.user.id || (b.shipment && b.shipment.entrepreneurId === req.user.id);
    });

    return res.status(200).json({ success: true, count: userBookings.length, bookings: userBookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, otp } = req.body;

    const allBookings = await dataStore.getBookings();
    const booking = allBookings.find((b) => b.id === id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify OTP for pickup or delivery
    if (status === 'PICKED_UP' && otp && String(otp).trim() !== String(booking.pickupOtp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid Pickup OTP code' });
    }
    if (status === 'DELIVERED' && otp && String(otp).trim() !== String(booking.deliveryOtp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid Delivery OTP code' });
    }

    const updated = await dataStore.updateBooking(id, { status });

    // Update shipment status along lifecycle
    if (status === 'PICKED_UP') {
      await dataStore.updateShipment(booking.shipmentId, { status: 'IN_TRANSIT' });
    } else if (status === 'DELIVERED') {
      await dataStore.updateShipment(booking.shipmentId, { status: 'DELIVERED' });
    }

    return res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
