const fs = require('fs');
const path = require('path');
const { prisma } = require('../config/db');
const { mockUsers, mockVehicles, mockTrips, mockShipments, mockBookings } = require('../utils/mockData');

const DATA_DIR = path.join(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('[MargMitra] Could not create data directory:', err.message);
  }
}

// In-memory working store
let store = {
  users: [...mockUsers],
  vehicles: [...mockVehicles],
  trips: [...mockTrips],
  shipments: [...mockShipments],
  bookings: [...mockBookings]
};

// Load persistent data from disk if available
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.users && parsed.trips) {
      store = parsed;
      console.log('[MargMitra] Persistent disk store loaded successfully.');
    }
  } else {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  }
} catch (err) {
  console.warn('[MargMitra] Notice: Running with memory store (' + err.message + ')');
}

function persistToDisk() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    // Non-blocking disk write
  }
}

let isPrismaAvailable = false;

// Check if Prisma connection is live
async function checkPrisma() {
  if (!prisma) return false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    isPrismaAvailable = true;
    return true;
  } catch (err) {
    isPrismaAvailable = false;
    return false;
  }
}

checkPrisma().then((available) => {
  if (available) {
    console.log('[MargMitra] Connected to live PostgreSQL database via Prisma.');
  } else {
    console.log('[MargMitra] PostgreSQL not configured or unreachable; using persistent file/memory store.');
  }
});

const dataStore = {
  // Users
  async findUserByPhone(phone) {
    if (isPrismaAvailable) {
      try {
        return await prisma.user.findUnique({ where: { phone } });
      } catch (e) { /* fallback */ }
    }
    return store.users.find((u) => u.phone === phone) || null;
  },

  async findUserById(id) {
    if (isPrismaAvailable) {
      try {
        return await prisma.user.findUnique({ where: { id } });
      } catch (e) { /* fallback */ }
    }
    return store.users.find((u) => u.id === id) || null;
  },

  async createUser(userData) {
    const newUser = {
      id: `usr-${Date.now()}`,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData
    };

    if (isPrismaAvailable) {
      try {
        return await prisma.user.create({ data: newUser });
      } catch (e) { /* fallback */ }
    }

    store.users.push(newUser);
    persistToDisk();
    return newUser;
  },

  // Vehicles
  async getVehicles(ownerId) {
    if (isPrismaAvailable) {
      try {
        return await prisma.vehicle.findMany({ where: ownerId ? { ownerId } : {} });
      } catch (e) { /* fallback */ }
    }
    if (ownerId) {
      return store.vehicles.filter((v) => v.ownerId === ownerId);
    }
    return store.vehicles;
  },

  async createVehicle(vehicleData) {
    const newVehicle = {
      id: `veh-${Date.now()}`,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      ...vehicleData
    };

    if (isPrismaAvailable) {
      try {
        return await prisma.vehicle.create({ data: newVehicle });
      } catch (e) { /* fallback */ }
    }

    store.vehicles.push(newVehicle);
    persistToDisk();
    return newVehicle;
  },

  // Trips
  async getTrips(filters = {}) {
    if (isPrismaAvailable) {
      try {
        return await prisma.trip.findMany({
          include: { transporter: true, vehicle: true, bookings: true },
          orderBy: { departureTime: 'asc' }
        });
      } catch (e) { /* fallback */ }
    }

    let result = store.trips.map((t) => ({
      ...t,
      transporter: store.users.find((u) => u.id === t.transporterId) || t.transporter,
      vehicle: store.vehicles.find((v) => v.id === t.vehicleId) || t.vehicle,
      bookings: store.bookings.filter((b) => b.tripId === t.id)
    }));

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.transporterId) {
      result = result.filter((t) => t.transporterId === filters.transporterId);
    }
    if (filters.minCapacity) {
      result = result.filter((t) => t.availableCapacityKg >= Number(filters.minCapacity));
    }

    return result;
  },

  async getTripById(id) {
    if (isPrismaAvailable) {
      try {
        return await prisma.trip.findUnique({
          where: { id },
          include: { transporter: true, vehicle: true, bookings: true }
        });
      } catch (e) { /* fallback */ }
    }

    const trip = store.trips.find((t) => t.id === id);
    if (!trip) return null;

    return {
      ...trip,
      transporter: store.users.find((u) => u.id === trip.transporterId) || trip.transporter,
      vehicle: store.vehicles.find((v) => v.id === trip.vehicleId) || trip.vehicle,
      bookings: store.bookings.filter((b) => b.tripId === trip.id)
    };
  },

  async createTrip(tripData) {
    const newTrip = {
      id: `trip-${Date.now()}`,
      status: 'PLANNED',
      ratePerKgKm: tripData.ratePerKgKm || 0.008,
      availableCapacityKg: tripData.totalCapacityKg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...tripData
    };

    if (isPrismaAvailable) {
      try {
        return await prisma.trip.create({ data: newTrip });
      } catch (e) { /* fallback */ }
    }

    store.trips.unshift(newTrip);
    persistToDisk();
    return this.getTripById(newTrip.id);
  },

  async updateTrip(id, updateData) {
    if (isPrismaAvailable) {
      try {
        return await prisma.trip.update({ where: { id }, data: updateData });
      } catch (e) { /* fallback */ }
    }

    const index = store.trips.findIndex((t) => t.id === id);
    if (index === -1) return null;
    store.trips[index] = { ...store.trips[index], ...updateData, updatedAt: new Date().toISOString() };
    persistToDisk();
    return this.getTripById(id);
  },

  // Shipments
  async getShipments(filters = {}) {
    if (isPrismaAvailable) {
      try {
        return await prisma.shipmentRequest.findMany({
          include: { entrepreneur: true, bookings: true },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) { /* fallback */ }
    }

    let result = store.shipments.map((s) => ({
      ...s,
      entrepreneur: store.users.find((u) => u.id === s.entrepreneurId) || s.entrepreneur,
      bookings: store.bookings.filter((b) => b.shipmentId === s.id)
    }));

    if (filters.status) {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters.entrepreneurId) {
      result = result.filter((s) => s.entrepreneurId === filters.entrepreneurId);
    }

    return result;
  },

  async getShipmentById(id) {
    if (isPrismaAvailable) {
      try {
        return await prisma.shipmentRequest.findUnique({
          where: { id },
          include: { entrepreneur: true, bookings: true }
        });
      } catch (e) { /* fallback */ }
    }

    const s = store.shipments.find((item) => item.id === id);
    if (!s) return null;
    return {
      ...s,
      entrepreneur: store.users.find((u) => u.id === s.entrepreneurId) || s.entrepreneur,
      bookings: store.bookings.filter((b) => b.shipmentId === s.id)
    };
  },

  async createShipment(shipmentData) {
    const newShipment = {
      id: `ship-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...shipmentData
    };

    if (isPrismaAvailable) {
      try {
        return await prisma.shipmentRequest.create({ data: newShipment });
      } catch (e) { /* fallback */ }
    }

    store.shipments.unshift(newShipment);
    persistToDisk();
    return this.getShipmentById(newShipment.id);
  },

  async updateShipment(id, updateData) {
    if (isPrismaAvailable) {
      try {
        return await prisma.shipmentRequest.update({ where: { id }, data: updateData });
      } catch (e) { /* fallback */ }
    }

    const index = store.shipments.findIndex((s) => s.id === id);
    if (index === -1) return null;
    store.shipments[index] = { ...store.shipments[index], ...updateData, updatedAt: new Date().toISOString() };
    persistToDisk();
    return this.getShipmentById(id);
  },

  // Bookings
  async getBookings(filters = {}) {
    if (isPrismaAvailable) {
      try {
        return await prisma.booking.findMany({
          include: { trip: true, shipment: true, requester: true }
        });
      } catch (e) { /* fallback */ }
    }

    let result = store.bookings.map((b) => ({
      ...b,
      trip: store.trips.find((t) => t.id === b.tripId),
      shipment: store.shipments.find((s) => s.id === b.shipmentId),
      requester: store.users.find((u) => u.id === b.requesterId)
    }));

    if (filters.requesterId) {
      result = result.filter((b) => b.requesterId === filters.requesterId);
    }
    if (filters.tripId) {
      result = result.filter((b) => b.tripId === filters.tripId);
    }
    if (filters.transporterId) {
      result = result.filter((b) => b.trip && b.trip.transporterId === filters.transporterId);
    }

    return result;
  },

  async createBooking(bookingData) {
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newBooking = {
      id: `book-${Date.now()}`,
      status: 'CONFIRMED',
      pickupOtp,
      deliveryOtp,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...bookingData
    };

    if (isPrismaAvailable) {
      try {
        return await prisma.booking.create({ data: newBooking });
      } catch (e) { /* fallback */ }
    }

    store.bookings.unshift(newBooking);

    // Update trip available capacity
    const trip = store.trips.find((t) => t.id === newBooking.tripId);
    if (trip) {
      trip.availableCapacityKg = Math.max(0, trip.availableCapacityKg - newBooking.bookedWeightKg);
    }

    // Update shipment status
    const shipment = store.shipments.find((s) => s.id === newBooking.shipmentId);
    if (shipment) {
      shipment.status = 'MATCHED';
    }

    persistToDisk();
    return newBooking;
  },

  async updateBooking(id, updateData) {
    if (isPrismaAvailable) {
      try {
        return await prisma.booking.update({ where: { id }, data: updateData });
      } catch (e) { /* fallback */ }
    }

    const index = store.bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    store.bookings[index] = { ...store.bookings[index], ...updateData, updatedAt: new Date().toISOString() };
    persistToDisk();
    return store.bookings[index];
  }
};

module.exports = dataStore;
