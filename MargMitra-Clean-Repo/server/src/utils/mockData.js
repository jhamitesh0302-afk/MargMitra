// Initial realistic mock data for MargMitra demonstration & fallback
const mockUsers = [
  {
    id: "usr-ent-1",
    name: "Ramesh Patil",
    phone: "9876543210",
    email: "ramesh@margmitra.org",
    role: "ENTREPRENEUR",
    village: "Niphad",
    district: "Nashik",
    state: "Maharashtra",
    rating: 4.8
  },
  {
    id: "usr-ent-2",
    name: "Sunita Devi",
    phone: "9876543211",
    email: "sunita@margmitra.org",
    role: "ENTREPRENEUR",
    village: "Malur",
    district: "Kolar",
    state: "Karnataka",
    rating: 4.9
  },
  {
    id: "usr-trans-1",
    name: "Balwant Singh",
    phone: "9876543220",
    email: "balwant@margmitra.org",
    role: "TRANSPORTER",
    village: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    rating: 4.9
  },
  {
    id: "usr-trans-2",
    name: "Manjunath Gowda",
    phone: "9876543221",
    email: "manjunath@margmitra.org",
    role: "TRANSPORTER",
    village: "Hoskote",
    district: "Bengaluru Rural",
    state: "Karnataka",
    rating: 4.7
  }
];

const mockVehicles = [
  {
    id: "veh-1",
    ownerId: "usr-trans-1",
    vehicleType: "PICKUP",
    registrationNo: "MH 15 GH 4210",
    model: "Mahindra Bolero Maxi Truck",
    maxCapacityKg: 1500,
    isAvailable: true
  },
  {
    id: "veh-2",
    ownerId: "usr-trans-1",
    vehicleType: "TRACTOR_TROLLEY",
    registrationNo: "MH 15 T 8832",
    model: "Swaraj 744 FE + Hydraulic Trolley",
    maxCapacityKg: 3500,
    isAvailable: true
  },
  {
    id: "veh-3",
    ownerId: "usr-trans-2",
    vehicleType: "MINI_TRUCK",
    registrationNo: "KA 53 B 1904",
    model: "Tata Ace Gold",
    maxCapacityKg: 750,
    isAvailable: true
  }
];

const mockTrips = [
  {
    id: "trip-1",
    transporterId: "usr-trans-1",
    transporter: mockUsers[2],
    vehicleId: "veh-1",
    vehicle: mockVehicles[0],
    originName: "Niphad Village, Nashik",
    originLat: 20.0768,
    originLng: 74.1105,
    destinationName: "Vashi APMC Mandi, Navi Mumbai",
    destinationLat: 19.0732,
    destinationLng: 73.0039,
    departureTime: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    estimatedArrivalTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    totalCapacityKg: 1500,
    availableCapacityKg: 950,
    ratePerKgKm: 0.008,
    flatRate: 1800,
    notes: "Returning from Sinnar fertilizer depot. Empty truck heading to Vashi. Willing to pick fresh vegetables/onions along highway.",
    status: "PLANNED",
    createdAt: new Date().toISOString()
  },
  {
    id: "trip-2",
    transporterId: "usr-trans-2",
    transporter: mockUsers[3],
    vehicleId: "veh-3",
    vehicle: mockVehicles[2],
    originName: "Malur Village, Kolar",
    originLat: 13.0041,
    originLng: 77.9427,
    destinationName: "KR Market, Bengaluru",
    destinationLat: 12.9634,
    destinationLng: 77.5755,
    departureTime: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
    estimatedArrivalTime: new Date(Date.now() + 13 * 3600 * 1000).toISOString(),
    totalCapacityKg: 750,
    availableCapacityKg: 400,
    ratePerKgKm: 0.05,
    flatRate: 850,
    notes: "Early morning tomato & vegetable delivery trip. Space available for crates or sacks.",
    status: "PLANNED",
    createdAt: new Date().toISOString()
  },
  {
    id: "trip-3",
    transporterId: "usr-trans-1",
    transporter: mockUsers[2],
    vehicleId: "veh-2",
    vehicle: mockVehicles[1],
    originName: "Sinnar Rural Hub",
    originLat: 19.8475,
    originLng: 73.9961,
    destinationName: "Nashik City Central Mandi",
    destinationLat: 19.9975,
    destinationLng: 73.7898,
    departureTime: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
    estimatedArrivalTime: new Date(Date.now() + 33 * 3600 * 1000).toISOString(),
    totalCapacityKg: 3500,
    availableCapacityKg: 2200,
    ratePerKgKm: 0.03,
    flatRate: 1500,
    notes: "Grain and sugarcane run. High weight capacity trolley available.",
    status: "PLANNED",
    createdAt: new Date().toISOString()
  }
];

const mockShipments = [
  {
    id: "ship-1",
    entrepreneurId: "usr-ent-1",
    entrepreneur: mockUsers[0],
    title: "Fresh Nashik Red Onions (20 Bags)",
    cargoType: "PERISHABLE_PRODUCE",
    weightKg: 500,
    volumeCft: 35,
    pickupLocation: "Niphad Village Gate, Nashik",
    pickupLat: 20.0812,
    pickupLng: 74.1082,
    dropoffLocation: "Vashi APMC Yard Gate 3",
    dropoffLat: 19.0735,
    dropoffLng: 73.0045,
    pickupDate: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
    maxBudget: 2200,
    specialInstructions: "Keep dry, ventilated jute sacks.",
    status: "MATCHED",
    createdAt: new Date().toISOString()
  },
  {
    id: "ship-2",
    entrepreneurId: "usr-ent-2",
    entrepreneur: mockUsers[1],
    title: "Organic Tomatoes (12 Crates)",
    cargoType: "PERISHABLE_PRODUCE",
    weightKg: 300,
    volumeCft: 20,
    pickupLocation: "Malur Farmers Market",
    pickupLat: 13.0062,
    pickupLng: 77.9405,
    dropoffLocation: "KR Market Perishable Shed",
    dropoffLat: 12.9640,
    dropoffLng: 77.5740,
    pickupDate: new Date(Date.now() + 9 * 3600 * 1000).toISOString(),
    maxBudget: 1000,
    specialInstructions: "Careful stacking, fragile ripe tomatoes.",
    status: "PENDING",
    createdAt: new Date().toISOString()
  },
  {
    id: "ship-3",
    entrepreneurId: "usr-ent-1",
    entrepreneur: mockUsers[0],
    title: "Jaggery Slabs & Desi Ghee",
    cargoType: "GENERAL_GOODS",
    weightKg: 200,
    volumeCft: 12,
    pickupLocation: "Sinnar Milk Cooperative",
    pickupLat: 19.8450,
    pickupLng: 73.9940,
    dropoffLocation: "Nashik Retail Emporium",
    dropoffLat: 19.9950,
    dropoffLng: 73.7910,
    pickupDate: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    maxBudget: 800,
    specialInstructions: "Sealed cartons.",
    status: "PENDING",
    createdAt: new Date().toISOString()
  }
];

const mockBookings = [
  {
    id: "book-1",
    tripId: "trip-1",
    trip: mockTrips[0],
    shipmentId: "ship-1",
    shipment: mockShipments[0],
    requesterId: "usr-ent-1",
    requester: mockUsers[0],
    bookedWeightKg: 500,
    agreedPrice: 1850,
    pickupOtp: "4921",
    deliveryOtp: "8305",
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  }
];

module.exports = {
  mockUsers,
  mockVehicles,
  mockTrips,
  mockShipments,
  mockBookings
};
