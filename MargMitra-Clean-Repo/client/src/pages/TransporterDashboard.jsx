import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import RouteMap from '../components/maps/RouteMap';
import {
  Truck,
  Plus,
  Package,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Users,
  Sparkles,
  ChevronRight,
  KeyRound,
  X,
  Gauge,
  Play,
  Check
} from 'lucide-react';

export default function TransporterDashboard() {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [cargoMatches, setCargoMatches] = useState([]);
  const [scanningCargo, setScanningCargo] = useState(false);

  // Modals
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpActionType, setOtpActionType] = useState('PICKED_UP');
  const [targetBookingId, setTargetBookingId] = useState('');
  const [otpValue, setOtpValue] = useState('');

  // Forms
  const [tripForm, setTripForm] = useState({
    vehicleId: 'veh-1',
    originName: 'Sinnar Rural Hub, Nashik',
    originLat: 19.8475,
    originLng: 73.9961,
    destinationName: 'Vashi APMC Mandi, Navi Mumbai',
    destinationLat: 19.0732,
    destinationLng: 73.0039,
    departureTime: new Date(Date.now() + 18 * 3600 * 1000).toISOString().slice(0, 16),
    totalCapacityKg: 1500,
    ratePerKgKm: 0.008,
    flatRate: 1800,
    notes: 'Returning from fertilizer delivery. Empty flatbed ready for produce/crates.'
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicleType: 'PICKUP',
    model: 'Mahindra Bolero Maxi Truck',
    registrationNo: 'MH 15 GH 4210',
    maxCapacityKg: 1500
  });

  const fetchTripsAndVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/trips');
      const data = await res.json();
      if (data.success && data.trips) {
        setTrips(data.trips);
        if (data.trips.length > 0) {
          setSelectedTrip(data.trips[0]);
        }
      }

      const vehRes = await fetch('http://localhost:5000/api/vehicles/my', {
        headers: { Authorization: `Bearer ${token || 'demo_token_transporter_123'}` }
      });
      const vehData = await vehRes.json();
      if (vehData.success && vehData.vehicles) {
        setVehicles(vehData.vehicles);
      }
    } catch (err) {
      console.error('Error fetching transporter data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripsAndVehicles();
  }, []);

  // Scan cargo along route when selected trip changes
  useEffect(() => {
    if (!selectedTrip) return;
    setScanningCargo(true);
    fetch(`http://localhost:5000/api/trips/${selectedTrip.id}/matching-shipments`, {
      headers: { Authorization: `Bearer ${token || 'demo_token_transporter_123'}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCargoMatches(data.matches || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setScanningCargo(false));
  }, [selectedTrip]);

  const handlePublishTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'demo_token_transporter_123'}`
        },
        body: JSON.stringify(tripForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsTripModalOpen(false);
        addToast('Route scheduled successfully!', 'success');
        fetchTripsAndVehicles();
        setSelectedTrip(data.trip);
      }
    } catch (err) {
      addToast('Failed to schedule trip', 'error');
    }
  };

  const handleRegisterVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'demo_token_transporter_123'}`
        },
        body: JSON.stringify(vehicleForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsVehicleModalOpen(false);
        addToast('Vehicle added to fleet!', 'success');
        fetchTripsAndVehicles();
      }
    } catch (err) {
      addToast('Failed to register vehicle', 'error');
    }
  };

  const handleAcceptCargo = async (match) => {
    if (!selectedTrip) return;
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'demo_token_transporter_123'}`
        },
        body: JSON.stringify({
          tripId: selectedTrip.id,
          shipmentId: match.shipment.id,
          bookedWeightKg: match.shipment.weightKg,
          agreedPrice: match.proposedEarnings
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Cargo accepted! +₹${match.proposedEarnings} added to trip`, 'success');
        fetchTripsAndVehicles();
      }
    } catch (err) {
      addToast('Error accepting cargo', 'error');
    }
  };

  const handleTripStatusChange = async (tripId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${tripId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'demo_token_transporter_123'}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Trip status updated to ${newStatus.replace('_', ' ')}`, 'success');
        fetchTripsAndVehicles();
      }
    } catch (err) {
      addToast('Failed to update trip status', 'error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${targetBookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || 'demo_token_transporter_123'}`
        },
        body: JSON.stringify({
          status: otpActionType,
          otp: otpValue
        })
      });
      const data = await res.json();
      if (data.success) {
        addToast('OTP verified! Cargo handover confirmed.', 'success');
        setOtpModalOpen(false);
        setOtpValue('');
        fetchTripsAndVehicles();
      } else {
        addToast(data.message || 'Invalid OTP', 'error');
      }
    } catch (err) {
      addToast('Error verifying OTP', 'error');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#F7F8F5]">
      {/* Left Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateDelivery={() => setIsTripModalOpen(true)}
      />

      {/* Main Transporter Command Center */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#0B5D4A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {user?.name ? user.name.charAt(0) : 'B'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#12212B]">
                Welcome, {user?.name || 'Balwant Singh'}
              </h1>
              <p className="text-xs text-[#68756F]">
                Transporter Hub • Zero empty return trips ("खाली वापसी बंद")
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-[#12212B] hover:bg-slate-50 transition-colors"
            >
              + Register Vehicle
            </button>
            <button
              onClick={() => setIsTripModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B5D4A] hover:bg-[#073B32] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Route</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
            <div className="text-xs font-semibold text-[#68756F]">Active Trips</div>
            <div className="text-3xl font-extrabold text-[#12212B] mt-1.5">{trips.length}</div>
            <div className="text-[11px] text-[#0B5D4A] font-semibold mt-1">Scheduled corridors</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
            <div className="text-xs font-semibold text-[#68756F]">Spare Payload</div>
            <div className="text-3xl font-extrabold text-[#12212B] mt-1.5">
              {trips.reduce((acc, t) => acc + (t.availableCapacityKg || 0), 0)} kg
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Available for cargo</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
            <div className="text-xs font-semibold text-[#68756F]">Extra Route Income</div>
            <div className="text-3xl font-extrabold text-[#0B5D4A] mt-1.5">
              +₹{cargoMatches.reduce((acc, m) => acc + (m.proposedEarnings || 0), 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-[#0B5D4A] font-semibold mt-1">From waiting requests</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
            <div className="text-xs font-semibold text-[#68756F]">Fleet Vehicles</div>
            <div className="text-3xl font-extrabold text-[#12212B] mt-1.5">{vehicles.length || 2}</div>
            <div className="text-[11px] text-slate-500 mt-1">Verified on platform</div>
          </div>
        </div>

        {/* Split Grid: Scheduled Routes on Left, Interactive Map & Waiting Cargo on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Scheduled Routes List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#12212B]">My Scheduled Corridors</h3>
              <span className="text-xs text-[#68756F]">{trips.length} active</span>
            </div>

            <div className="space-y-3">
              {trips.map((trip) => {
                const isSelected = selectedTrip?.id === trip.id;
                const fillPercent = Math.round(
                  ((trip.totalCapacityKg - trip.availableCapacityKg) / trip.totalCapacityKg) * 100
                );

                return (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#DDF3E7]/40 border-[#0B5D4A] ring-2 ring-[#0B5D4A]/20 shadow-xs'
                        : 'bg-white border-[#E6ECE8] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#12212B]">
                          {trip.originName.split(',')[0]} ➔ {trip.destinationName.split(',')[0]}
                        </h4>
                        <div className="text-[11px] text-[#68756F]">
                          {trip.vehicle?.model || 'Mahindra Bolero Maxi'} ({trip.vehicle?.registrationNo || 'MH 15 GH 4210'})
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DDF3E7] text-[#0B5D4A]">
                        {trip.status}
                      </span>
                    </div>

                    {/* Capacity Fill-Rate Progress */}
                    <div className="space-y-1 my-2">
                      <div className="flex justify-between text-[11px] text-[#68756F]">
                        <span>Load Fill-rate:</span>
                        <span className="font-bold text-[#12212B]">
                          {trip.totalCapacityKg - trip.availableCapacityKg} / {trip.totalCapacityKg} kg ({fillPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0B5D4A] rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.max(10, fillPercent))}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Trip Status Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-slate-500">
                        {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {trip.status === 'PLANNED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTripStatusChange(trip.id, 'ON_THE_WAY');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#0B5D4A] text-white text-[11px] font-bold flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-white" /> Start Trip
                          </button>
                        )}
                        {trip.status === 'ON_THE_WAY' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTripStatusChange(trip.id, 'COMPLETED');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map & Waiting Cargo Opportunities on Route */}
          <div className="lg:col-span-7 space-y-5">
            {selectedTrip && (
              <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#12212B]">
                      {selectedTrip.originName.split(',')[0]} to {selectedTrip.destinationName.split(',')[0]}
                    </h3>
                    <p className="text-[11px] text-[#68756F]">
                      {selectedTrip.availableCapacityKg} kg spare capacity along this corridor
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#DDF3E7] text-[#0B5D4A]">
                    Departing {new Date(selectedTrip.departureTime).toLocaleDateString()}
                  </span>
                </div>

                <RouteMap
                  origin={{
                    lat: selectedTrip.originLat,
                    lng: selectedTrip.originLng,
                    name: selectedTrip.originName
                  }}
                  destination={{
                    lat: selectedTrip.destinationLat,
                    lng: selectedTrip.destinationLng,
                    name: selectedTrip.destinationName
                  }}
                  height="260px"
                />

                {/* Waiting Cargo Demands along route */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#0B5D4A]" />
                      <h4 className="font-bold text-xs text-[#12212B]">
                        Pending Cargo Pickups Along This Route ({cargoMatches.length})
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#68756F]">Monetize empty return</span>
                  </div>

                  {scanningCargo ? (
                    <div className="p-6 text-center text-xs text-slate-400">Scanning village requests...</div>
                  ) : cargoMatches.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 rounded-xl bg-[#F7F8F5]">
                      No pending shipments along this corridor at this moment.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {cargoMatches.map((m) => (
                        <div
                          key={m.shipment.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-[#F7F8F5]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#12212B]">{m.shipment.title}</div>
                            <div className="text-[11px] text-[#68756F] mt-0.5">
                              Pickup: {m.shipment.pickupLocation.split(',')[0]} • {m.shipment.weightKg} kg payload
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <span className="font-extrabold text-sm text-[#0B5D4A]">
                              +₹{m.proposedEarnings}
                            </span>
                            <button
                              onClick={() => handleAcceptCargo(m)}
                              className="px-3 py-1.5 rounded-lg bg-[#0B5D4A] hover:bg-[#073B32] text-white font-bold text-xs shadow-2xs"
                            >
                              Accept Load
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* OTP Handover Verification for Picked/Delivered loads */}
                {selectedTrip.bookings && selectedTrip.bookings.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#12212B]">
                      Confirmed Cargo Manifest ({selectedTrip.bookings.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTrip.bookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#12212B]">{b.bookedWeightKg} kg Cargo</div>
                            <div className="text-[11px] text-[#68756F]">Status: {b.status} • ₹{b.agreedPrice}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            {b.status === 'CONFIRMED' && (
                              <button
                                onClick={() => {
                                  setTargetBookingId(b.id);
                                  setOtpActionType('PICKED_UP');
                                  setOtpModalOpen(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-[#0B5D4A] text-white text-[11px] font-bold"
                              >
                                Enter Pickup OTP
                              </button>
                            )}
                            {b.status === 'PICKED_UP' && (
                              <button
                                onClick={() => {
                                  setTargetBookingId(b.id);
                                  setOtpActionType('DELIVERED');
                                  setOtpModalOpen(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-[#0B5D4A] text-white text-[11px] font-bold"
                              >
                                Enter Delivery OTP
                              </button>
                            )}
                            {b.status === 'DELIVERED' && (
                              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Schedule Trip Modal */}
      {isTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#0B5D4A]" />
                <h3 className="font-bold text-[#12212B]">Publish Scheduled Route</h3>
              </div>
              <button onClick={() => setIsTripModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishTrip} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#12212B] mb-1">Departure Origin (Village / Depot)</label>
                <input
                  type="text"
                  required
                  value={tripForm.originName}
                  onChange={(e) => setTripForm({ ...tripForm, originName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#12212B] mb-1">Destination Mandi / Market</label>
                <input
                  type="text"
                  required
                  value={tripForm.destinationName}
                  onChange={(e) => setTripForm({ ...tripForm, destinationName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Departure Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={tripForm.departureTime}
                    onChange={(e) => setTripForm({ ...tripForm, departureTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Available Payload (kg)</label>
                  <input
                    type="number"
                    required
                    value={tripForm.totalCapacityKg}
                    onChange={(e) => setTripForm({ ...tripForm, totalCapacityKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Target Flat Rent (₹)</label>
                  <input
                    type="number"
                    value={tripForm.flatRate}
                    onChange={(e) => setTripForm({ ...tripForm, flatRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Select Vehicle</label>
                  <select
                    value={tripForm.vehicleId}
                    onChange={(e) => setTripForm({ ...tripForm, vehicleId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="veh-1">Mahindra Bolero (1.5T)</option>
                    <option value="veh-2">Swaraj Tractor (3.5T)</option>
                    <option value="veh-3">Tata Ace Gold (750kg)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTripModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0B5D4A] rounded-xl hover:bg-[#073B32]"
                >
                  Publish Corridor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#12212B]">Register Fleet Vehicle</h3>
              <button onClick={() => setIsVehicleModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterVehicle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#12212B] mb-1">Vehicle Type</label>
                <select
                  value={vehicleForm.vehicleType}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="PICKUP">Pickup Truck (e.g. Bolero)</option>
                  <option value="TRACTOR_TROLLEY">Tractor + Trolley</option>
                  <option value="TEMPO">Tempo / Mini Truck</option>
                  <option value="THREE_WHEELER">3-Wheeler Auto Carrier</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#12212B] mb-1">Make & Model</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  placeholder="e.g. Mahindra Bolero Maxi Truck"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#12212B] mb-1">Registration Plate</label>
                <input
                  type="text"
                  required
                  value={vehicleForm.registrationNo}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNo: e.target.value })}
                  placeholder="e.g. MH 15 GH 4210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#12212B] mb-1">Max Payload Capacity (kg)</label>
                <input
                  type="number"
                  required
                  value={vehicleForm.maxCapacityKg}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, maxCapacityKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#0B5D4A] rounded-xl hover:bg-[#073B32]"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#0B5D4A]" />
                <h3 className="font-bold text-[#12212B]">
                  {otpActionType === 'PICKED_UP' ? 'Verify Pickup Handover' : 'Verify Delivery Handover'}
                </h3>
              </div>
              <button onClick={() => setOtpModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <p className="text-xs text-[#68756F]">
                Enter the 4-digit code provided by the {otpActionType === 'PICKED_UP' ? 'farmer' : 'receiver'}:
              </p>
              <input
                type="text"
                required
                maxLength="4"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="4-digit OTP (e.g. 4921)"
                className="w-full text-center text-2xl font-mono tracking-widest px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0B5D4A] hover:bg-[#073B32] text-white font-bold rounded-xl text-xs"
              >
                Verify & Advance Status
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
