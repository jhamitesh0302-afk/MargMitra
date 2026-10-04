import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import CreateDeliveryModal from '../components/delivery/CreateDeliveryModal';
import RouteMap from '../components/maps/RouteMap';
import {
  Package,
  Plus,
  Truck,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  KeyRound,
  Bell,
  Coins,
  ArrowRight,
  Users
} from 'lucide-react';

export default function EntrepreneurDashboard() {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [matchedTrips, setMatchedTrips] = useState([]);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Recent activity sample events matching Screen 3
  const recentActivity = [
    {
      id: 1,
      title: 'Trip Matched',
      desc: 'Pune → Nashik corridor with Bolero Maxi',
      time: '2 hours ago',
      icon: Sparkles,
      color: 'text-[#0B5D4A] bg-[#DDF3E7]'
    },
    {
      id: 2,
      title: 'Request Joined',
      desc: 'Sinnar depot driver accepted 300kg onions',
      time: '5 hours ago',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-100'
    },
    {
      id: 3,
      title: 'Trip Completed',
      desc: 'Delivered to Vashi APMC Gate 3',
      time: '1 day ago',
      icon: Package,
      color: 'text-slate-700 bg-slate-100'
    }
  ];

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/shipments');
      const data = await res.json();
      if (data.success && data.shipments) {
        setShipments(data.shipments);
        if (data.shipments.length > 0) {
          setSelectedShipment(data.shipments[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Fetch matched trips when selected shipment changes
  useEffect(() => {
    if (!selectedShipment) return;
    setMatchingLoading(true);
    fetch(`http://localhost:5000/api/shipments/${selectedShipment.id}/matching-trips`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMatchedTrips(data.matches || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setMatchingLoading(false));
  }, [selectedShipment]);

  const handleBookTrip = async (match) => {
    if (!selectedShipment) return;
    try {
      const authToken = token || 'demo_token_farmer_123';
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          tripId: match.trip.id,
          shipmentId: selectedShipment.id,
          bookedWeightKg: selectedShipment.weightKg,
          agreedPrice: match.estimatedSharedPrice
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(data.booking);
        addToast(`Shared space booked! Pickup OTP: ${data.booking.pickupOtp}`, 'success');
        fetchShipments();
      }
    } catch (err) {
      addToast('Error booking space', 'error');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#F7F8F5]">
      {/* 1. Left Sidebar Navigation matching Screen 3 */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateDelivery={() => setIsDeliveryModalOpen(true)}
      />

      {/* 2. Main Dashboard Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Greeting Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#0B5D4A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {user?.name ? user.name.charAt(0) : 'M'}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#12212B]">
                Good morning, {user?.name || 'Mitesh'}
              </h1>
              <p className="text-xs text-[#68756F]">
                Let's move your business forward. Rural corridor active.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => addToast('No unread notifications', 'info')}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDeliveryModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B5D4A] hover:bg-[#073B32] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Delivery</span>
            </button>
          </div>
        </div>

        {/* 3 Summary KPI Cards matching Screen 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
            <div className="text-xs font-semibold text-[#68756F]">Active Requests</div>
            <div className="text-3xl font-extrabold text-[#12212B] mt-1.5">{shipments.length}</div>
            <div className="text-[11px] text-[#0B5D4A] font-semibold mt-1">Pending pickup</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
            <div className="text-xs font-semibold text-[#68756F]">Available Trips</div>
            <div className="text-3xl font-extrabold text-[#12212B] mt-1.5">{matchedTrips.length + 3}</div>
            <div className="text-[11px] text-[#0B5D4A] font-semibold mt-1">Along scheduled routes</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs">
            <div className="text-xs font-semibold text-[#68756F]">Total Savings</div>
            <div className="text-3xl font-extrabold text-[#0B5D4A] mt-1.5">₹1,850</div>
            <div className="text-[11px] text-[#68756F] mt-1">vs. private solo rentals</div>
          </div>
        </div>

        {/* Booking Success OTP Banner */}
        {bookingSuccess && (
          <div className="p-4 rounded-2xl bg-[#DDF3E7] border border-[#63B98A] text-[#073B32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-0.5">
              <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0B5D4A]" />
                Shared Trip Confirmed! Give this code to driver at farm gate:
              </div>
              <div className="text-xs text-slate-700">
                Pickup Handover OTP: <strong className="font-mono text-base text-[#0B5D4A] tracking-wider">{bookingSuccess.pickupOtp}</strong>
              </div>
            </div>
            <button
              onClick={() => setBookingSuccess(null)}
              className="text-xs font-bold text-[#0B5D4A] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Center Split: Big Map on Left, Recent Activity on Right (Matching Screen 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Leaflet Corridor Map */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#12212B]">Active Route & Vehicle Visualizer</h3>
                <p className="text-[11px] text-[#68756F]">
                  {selectedShipment ? `${selectedShipment.pickupLocation.split(',')[0]} ➔ ${selectedShipment.dropoffLocation.split(',')[0]}` : 'Corridor view'}
                </p>
              </div>
              {selectedShipment && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DDF3E7] text-[#0B5D4A]">
                  {selectedShipment.weightKg} kg Payload
                </span>
              )}
            </div>

            {selectedShipment ? (
              <RouteMap
                origin={{
                  lat: selectedShipment.pickupLat,
                  lng: selectedShipment.pickupLng,
                  name: selectedShipment.pickupLocation
                }}
                destination={{
                  lat: selectedShipment.dropoffLat,
                  lng: selectedShipment.dropoffLng,
                  name: selectedShipment.dropoffLocation
                }}
                vehiclePos={{
                  lat: (selectedShipment.pickupLat + selectedShipment.dropoffLat) / 2,
                  lng: (selectedShipment.pickupLng + selectedShipment.dropoffLng) / 2
                }}
                height="320px"
              />
            ) : (
              <div className="h-[320px] rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                No active delivery selected.
              </div>
            )}
          </div>

          {/* Recent Activity Timeline (Matching Screen 3) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#12212B]">Recent Activity</h3>

            <div className="space-y-3.5">
              {recentActivity.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#12212B]">{act.title}</div>
                      <p className="text-[11px] text-[#68756F] truncate">{act.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Matched Shared Trips Section */}
        <div className="bg-white p-6 rounded-2xl border border-[#E6ECE8] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0B5D4A]" />
              <h3 className="font-bold text-sm text-[#12212B]">
                Matched Shared Trips for {selectedShipment?.title || 'Selected Cargo'} ({matchedTrips.length})
              </h3>
            </div>
            <span className="text-xs text-[#68756F]">Sorted by proximity & cost savings</span>
          </div>

          {matchingLoading ? (
            <div className="py-8 text-center text-xs text-slate-400">Scanning highway corridors...</div>
          ) : matchedTrips.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-[#F7F8F5]">
              No direct vehicle matches found for this corridor yet. We will notify drivers on route.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedTrips.map((match) => (
                <div
                  key={match.trip.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#63B98A] transition-all bg-[#F7F8F5]/60 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#12212B]">
                          {match.trip.transporter?.name || 'Verified Driver'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DDF3E7] text-[#0B5D4A]">
                          {match.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-[#68756F] mt-0.5">
                        {match.trip.vehicle?.model || 'Mahindra Bolero Maxi'} • {match.trip.availableCapacityKg} kg space
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-[#0B5D4A]">
                        ₹{match.estimatedSharedPrice}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Save ₹{match.savingsAmount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#68756F] pt-2 border-t border-slate-200/60">
                    <span>Departs: {new Date(match.trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button
                      onClick={() => handleBookTrip(match)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B5D4A] hover:bg-[#073B32] text-white font-bold text-xs shadow-2xs transition-colors"
                    >
                      Request to Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Guided Delivery Modal */}
      <CreateDeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSubmitSuccess={() => {
          addToast('Cargo requirement posted successfully!', 'success');
          fetchShipments();
        }}
      />
    </div>
  );
}
