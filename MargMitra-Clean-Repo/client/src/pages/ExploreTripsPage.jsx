import React, { useState, useEffect } from 'react';
import RouteMap from '../components/maps/RouteMap';
import { useToast } from '../context/ToastContext';
import {
  Truck,
  MapPin,
  Clock,
  Filter,
  Search,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  X,
  Star,
  Check
} from 'lucide-react';

export default function ExploreTripsPage() {
  const { addToast } = useToast();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar Filter State (Screen 5)
  const [searchRoute, setSearchRoute] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'SHARED' | 'FULL'

  // Selected Trip for Detailed View / Modal (Screen 6)
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingOtp, setBookingOtp] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/trips')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.trips) {
          setTrips(data.trips);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTrips = trips.filter((t) => {
    const routeText = `${t.originName} ${t.destinationName}`.toLowerCase();
    const matchesRoute = !searchRoute || routeText.includes(searchRoute.toLowerCase());
    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'SHARED' && t.availableCapacityKg < t.totalCapacityKg * 0.9) ||
      (filterType === 'FULL' && t.availableCapacityKg >= t.totalCapacityKg * 0.9);
    return matchesRoute && matchesFilter;
  });

  const handleOpenDetails = (trip) => {
    setSelectedTripDetails(trip);
  };

  const handleConfirmBooking = () => {
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setBookingOtp(randomOtp);
    setBookingConfirmed(true);
    addToast('Request sent to driver! Pickup code generated.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#12212B]">Available Transport & Shared Trips</h1>
        <p className="text-xs sm:text-sm text-[#68756F] mt-0.5">
          Find scheduled return trips, book spare capacity, and save up to 60% on rural cargo transit.
        </p>
      </div>

      {/* 2. Top Search & Filter Bar (Matching Screen 5) */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6ECE8] shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Route Search */}
          <div className="sm:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchRoute}
              onChange={(e) => setSearchRoute(e.target.value)}
              placeholder="Origin → Destination (e.g. Pune → Nashik, Sinnar, Malur)"
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
            />
          </div>

          {/* Date Picker */}
          <div className="sm:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Calendar className="w-4 h-4" />
            </span>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
            />
          </div>

          {/* Filter Action */}
          <div className="sm:col-span-2">
            <button
              onClick={() => addToast('Filters applied', 'info')}
              className="w-full py-2.5 px-4 bg-[#F7F8F5] hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-[#12212B] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Pills (Matching Screen 5: All, Shared Trips, Full Load) */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              filterType === 'ALL'
                ? 'bg-[#0B5D4A] text-white shadow-2xs'
                : 'bg-[#F7F8F5] text-[#68756F] hover:bg-slate-200'
            }`}
          >
            All ({trips.length})
          </button>
          <button
            onClick={() => setFilterType('SHARED')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              filterType === 'SHARED'
                ? 'bg-[#0B5D4A] text-white shadow-2xs'
                : 'bg-[#F7F8F5] text-[#68756F] hover:bg-slate-200'
            }`}
          >
            Shared Trips (5)
          </button>
          <button
            onClick={() => setFilterType('FULL')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              filterType === 'FULL'
                ? 'bg-[#0B5D4A] text-white shadow-2xs'
                : 'bg-[#F7F8F5] text-[#68756F] hover:bg-slate-200'
            }`}
          >
            Full Load (3)
          </button>
        </div>
      </div>

      {/* 3. Matching Results Cards (Matching Screen 5) */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading verified trips...</div>
        ) : filteredTrips.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No trips matching your filter. Try adjusting your search keywords.
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const isShared = trip.availableCapacityKg < trip.totalCapacityKg * 0.9;
            const price = Math.round(trip.flatRate || (trip.availableCapacityKg * 1.8));

            return (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-[#E6ECE8] p-5 shadow-2xs hover:border-[#63B98A] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                {/* Vehicle Thumbnail & Route Details */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#DDF3E7] text-[#0B5D4A] flex items-center justify-center text-2xl shrink-0">
                    {trip.vehicle?.vehicleType === 'TRACTOR_TROLLEY' ? '🚜' : '🛻'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-md">
                        {isShared ? 'Shared Trip (2 seats / space)' : 'Full Load Available'}
                      </span>
                      <span className="text-xs text-[#68756F] font-medium">
                        {trip.vehicle?.model || 'Mahindra Bolero Maxi'} • {trip.vehicle?.maxCapacityKg || 1500}kg
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#12212B] flex items-center gap-2">
                      <span>{trip.originName.split(',')[0]}</span>
                      <span className="text-slate-400">➔</span>
                      <span>{trip.destinationName.split(',')[0]}</span>
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-[#68756F]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#0B5D4A]" />
                        <span>{new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(trip.departureTime).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">
                        {trip.availableCapacityKg} kg capacity free
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and Prominent CTA */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-1.5 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-extrabold text-[#0B5D4A]">
                      ₹{price.toLocaleString()}
                      <span className="text-xs font-normal text-[#68756F]"> / seat or lot</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Includes GST & toll</div>
                  </div>

                  <button
                    onClick={() => handleOpenDetails(trip)}
                    className="px-6 py-2.5 bg-[#0B5D4A] hover:bg-[#073B32] text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Request to Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. SHARED TRIP DETAILS & BOOKING MODAL (Matching Screen 6) */}
      {selectedTripDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-6">
            {/* Top Back Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => setSelectedTripDetails(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#68756F] hover:text-[#12212B]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Trips</span>
              </button>
              <button
                onClick={() => setSelectedTripDetails(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trip Header Banner (Screen 6) */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#0B5D4A] bg-[#DDF3E7] px-2.5 py-0.5 rounded-full">
                  Shared Trip • 2 seats / space available
                </span>
                <h2 className="text-xl font-extrabold text-[#12212B]">
                  {selectedTripDetails.originName.split(',')[0]} ➔ {selectedTripDetails.destinationName.split(',')[0]}
                </h2>
                <p className="text-xs text-[#68756F]">
                  Vehicle: {selectedTripDetails.vehicle?.model || 'Mahindra Bolero Maxi Truck'} • {selectedTripDetails.vehicle?.maxCapacityKg} kg
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-[#0B5D4A]">
                  ₹{selectedTripDetails.flatRate || 1200}
                </div>
                <div className="text-[11px] text-[#68756F]">per seat / produce lot</div>
              </div>
            </div>

            {/* Trip Route Visual Timeline (Screen 6) */}
            <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-slate-200/80 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#68756F]">Trip Route</div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <div className="font-extrabold text-[#12212B]">{selectedTripDetails.originName.split(',')[0]}</div>
                  <div className="text-[11px] text-[#68756F]">Pickup 08:00 AM</div>
                </div>

                <div className="flex-1 mx-4 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0B5D4A]"></div>
                  <div className="flex-1 h-0.5 bg-[#0B5D4A]/30 border-b border-dashed border-[#0B5D4A]"></div>
                  <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 bg-white rounded-full border border-slate-200">
                    Transit ~2h 30m
                  </span>
                  <div className="flex-1 h-0.5 bg-[#0B5D4A]/30 border-b border-dashed border-[#0B5D4A]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-[#12212B]">{selectedTripDetails.destinationName.split(',')[0]}</div>
                  <div className="text-[11px] text-[#68756F]">Dropoff 10:30 AM</div>
                </div>
              </div>
            </div>

            {/* Split Information Cards: Driver Card & Trip Details (Screen 6) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Driver / Vehicle Owner Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6ECE8] space-y-2 shadow-2xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#68756F]">
                  Driver / Vehicle Owner
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-full bg-[#0B5D4A] text-white flex items-center justify-center font-bold text-sm">
                    {selectedTripDetails.transporter?.name?.charAt(0) || 'B'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#12212B]">
                      {selectedTripDetails.transporter?.name || 'Balwant Singh'}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#0B5D4A] font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>4.8 (24 trips)</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-[#68756F] pt-1 border-t border-slate-100">
                  Vehicle: {selectedTripDetails.vehicle?.model || 'Mahindra Bolero'} • {selectedTripDetails.vehicle?.registrationNo || 'MH 15 GH 4210'}
                </div>
              </div>

              {/* Trip Technical Details */}
              <div className="p-4 rounded-2xl bg-white border border-[#E6ECE8] space-y-2 shadow-2xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#68756F]">
                  Trip Details
                </div>
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex justify-between">
                    <span className="text-[#68756F]">Total Distance:</span>
                    <span className="font-bold text-[#12212B]">180 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68756F]">Weight Capacity:</span>
                    <span className="font-bold text-[#12212B]">1.5 Ton</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68756F]">Shared Seats Available:</span>
                    <span className="font-bold text-[#0B5D4A]">2 seats / 600 kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Confirmation / OTP Modal state */}
            {bookingConfirmed ? (
              <div className="p-4 rounded-2xl bg-[#DDF3E7] border border-[#63B98A] text-center space-y-2">
                <div className="text-sm font-bold text-[#073B32] flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#0B5D4A]" />
                  <span>Booking Requested Successfully!</span>
                </div>
                <p className="text-xs text-slate-700">
                  Driver has been notified. Handover this Pickup OTP to verify cargo loading:
                </p>
                <div className="inline-block px-4 py-1.5 bg-white rounded-xl border border-[#63B98A] text-lg font-mono font-bold text-[#0B5D4A] tracking-widest">
                  {bookingOtp}
                </div>
              </div>
            ) : (
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3.5 bg-[#0B5D4A] hover:bg-[#073B32] text-white font-extrabold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Request to Join Trip (Pay ₹{selectedTripDetails.flatRate || 1200})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
