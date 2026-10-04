import React, { useState } from 'react';
import RouteMap from '../maps/RouteMap';
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const REGIONAL_HUBS = [
  { name: 'Niphad Village Gate, Nashik', lat: 20.0812, lng: 74.1082 },
  { name: 'Sinnar Rural Hub, Nashik', lat: 19.8475, lng: 73.9961 },
  { name: 'Vashi APMC Mandi, Navi Mumbai', lat: 19.0735, lng: 73.0045 },
  { name: 'Pune Gultekdi Market Yard', lat: 18.4965, lng: 73.8682 },
  { name: 'Baramati Agro Center, Pune', lat: 18.1519, lng: 74.5772 },
  { name: 'Malur Farmers Hub, Kolar', lat: 13.0062, lng: 77.9405 },
  { name: 'KR Market Perishable Yard, Bengaluru', lat: 12.9640, lng: 77.5740 },
  { name: 'Ahmednagar APMC Market', lat: 19.0952, lng: 74.7496 }
];

export default function CreateDeliveryModal({ isOpen, onClose, onSubmitSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: 'Fresh Red Onions (25 Bags)',
    category: 'Agricultural Produce', // Agricultural Produce, Raw Material, Finished Goods, Other
    weightKg: 350,
    volumeCft: 25,
    pickupLocation: REGIONAL_HUBS[0].name,
    pickupLat: REGIONAL_HUBS[0].lat,
    pickupLng: REGIONAL_HUBS[0].lng,
    dropoffLocation: REGIONAL_HUBS[2].name,
    dropoffLat: REGIONAL_HUBS[2].lat,
    dropoffLng: REGIONAL_HUBS[2].lng,
    preferredDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
    vehiclePreference: 'PICKUP', // Any, PICKUP, TEMPO, TRACTOR
    isSharedTrip: true,
    maxBudget: 1400,
    specialRequirements: 'Keep dry, ventilated jute sacks.'
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePickupChange = (locationName) => {
    const hub = REGIONAL_HUBS.find((h) => h.name === locationName) || {
      name: locationName,
      lat: 20.0812,
      lng: 74.1082
    };
    setFormData((prev) => ({
      ...prev,
      pickupLocation: hub.name,
      pickupLat: hub.lat,
      pickupLng: hub.lng
    }));
  };

  const handleDropoffChange = (locationName) => {
    const hub = REGIONAL_HUBS.find((h) => h.name === locationName) || {
      name: locationName,
      lat: 19.0735,
      lng: 73.0045
    };
    setFormData((prev) => ({
      ...prev,
      dropoffLocation: hub.name,
      dropoffLat: hub.lat,
      dropoffLng: hub.lng
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('margmitra_token') || 'demo_token_farmer_123';
      const res = await fetch('http://localhost:5000/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          cargoType: formData.category === 'Agricultural Produce' ? 'PERISHABLE_PRODUCE' : 'GENERAL_GOODS',
          weightKg: Number(formData.weightKg),
          volumeCft: Number(formData.volumeCft),
          pickupLocation: formData.pickupLocation,
          pickupLat: formData.pickupLat,
          pickupLng: formData.pickupLng,
          dropoffLocation: formData.dropoffLocation,
          dropoffLat: formData.dropoffLat,
          dropoffLng: formData.dropoffLng,
          pickupDate: formData.preferredDate,
          maxBudget: Number(formData.maxBudget),
          specialInstructions: formData.specialRequirements
        })
      });

      const data = await res.json();
      if (data.success) {
        if (onSubmitSuccess) onSubmitSuccess(data.shipment);
        onClose();
      }
    } catch (err) {
      console.error('Error submitting delivery request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B5D4A] flex items-center justify-center text-white">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#12212B]">Create Delivery Request</h3>
              <p className="text-[11px] text-[#68756F]">Guided 3-step cargo posting experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar (Matching Screen 4: 1. Details → 2. Location → 3. Review) */}
        <div className="px-6 py-3 bg-[#F7F8F5] border-b border-slate-200/80 flex items-center justify-center gap-6 sm:gap-12 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 1 ? 'bg-[#0B5D4A] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className={currentStep === 1 ? 'text-[#0B5D4A] font-bold' : 'text-[#68756F]'}>
              1. Details
            </span>
          </div>

          <div className="w-8 h-px bg-slate-300"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 2 ? 'bg-[#0B5D4A] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={currentStep === 2 ? 'text-[#0B5D4A] font-bold' : 'text-[#68756F]'}>
              2. Location
            </span>
          </div>

          <div className="w-8 h-px bg-slate-300"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3 ? 'bg-[#0B5D4A] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={currentStep === 3 ? 'text-[#0B5D4A] font-bold' : 'text-[#68756F]'}>
              3. Review
            </span>
          </div>
        </div>

        {/* Modal Body: Split Form + Live Map */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Multi-Step Input Forms */}
          <div className="lg:col-span-6 space-y-4">
            {/* STEP 1: GOODS DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#12212B] mb-1.5">What are you moving?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Agricultural Produce', 'Raw Material', 'Finished Goods', 'Other'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                          formData.category === cat
                            ? 'border-[#0B5D4A] bg-[#DDF3E7] text-[#0B5D4A] font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Produce / Cargo Description</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Fresh Red Onions (25 Bags)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#12212B] mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      min="10"
                      max="10000"
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#12212B] mb-1">Approx. Volume (cft)</label>
                    <input
                      type="number"
                      value={formData.volumeCft}
                      onChange={(e) => setFormData({ ...formData, volumeCft: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Special Handling Instructions</label>
                  <textarea
                    rows="2"
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    placeholder="e.g. Keep dry, avoid moisture, delicate crates."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                  ></textarea>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATIONS & DATE */}
            {currentStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Pickup Farm / Village Location</label>
                  <select
                    value={formData.pickupLocation}
                    onChange={(e) => handlePickupChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                  >
                    {REGIONAL_HUBS.map((h) => (
                      <option key={h.name} value={h.name}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Dropoff Mandi / City Destination</label>
                  <select
                    value={formData.dropoffLocation}
                    onChange={(e) => handleDropoffChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                  >
                    {REGIONAL_HUBS.map((h) => (
                      <option key={h.name} value={h.name}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Expected Pickup Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: TRANSPORT PREFERENCE & CONFIRMATION */}
            {currentStep === 3 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#12212B] mb-1.5">Vehicle Type Preference</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'PICKUP', label: 'Pickup (1.5 Ton)' },
                      { id: 'TEMPO', label: 'Tempo / Ace (750 kg)' },
                      { id: 'TRACTOR', label: 'Tractor-Trolley (3.5T)' },
                      { id: 'ANY', label: 'Any Verified Vehicle' }
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, vehiclePreference: v.id })}
                        className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                          formData.vehiclePreference === v.id
                            ? 'border-[#0B5D4A] bg-[#DDF3E7] text-[#0B5D4A] font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#12212B] mb-1">Target Freight Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.maxBudget}
                    onChange={(e) => setFormData({ ...formData, maxBudget: Number(e.target.value) })}
                    placeholder="e.g. 1400"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#DDF3E7]/40 border border-[#63B98A]/30 space-y-1">
                  <div className="font-bold text-[#0B5D4A] text-xs">Request Summary</div>
                  <div className="text-[11px] text-slate-700">
                    Moving <strong>{formData.weightKg} kg</strong> of {formData.title} from {formData.pickupLocation.split(',')[0]} to {formData.dropoffLocation.split(',')[0]}.
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                    ✓ Handover secured with 4-digit pickup OTP.
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0B5D4A] hover:bg-[#073B32] rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#0B5D4A] hover:bg-[#073B32] rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Confirm & Publish Request'}
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Interactive Leaflet Route Preview */}
          <div className="lg:col-span-6 bg-[#F7F8F5] p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#12212B]">Route Corridor Preview</span>
              <span className="text-[11px] font-semibold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-full">
                Interactive Map
              </span>
            </div>

            <RouteMap
              origin={{
                lat: formData.pickupLat,
                lng: formData.pickupLng,
                name: formData.pickupLocation
              }}
              destination={{
                lat: formData.dropoffLat,
                lng: formData.dropoffLng,
                name: formData.dropoffLocation
              }}
              height="280px"
            />

            <div className="text-[11px] text-[#68756F] flex items-center justify-between pt-1">
              <span><strong>Pickup:</strong> {formData.pickupLocation.split(',')[0]}</span>
              <span><strong>Dropoff:</strong> {formData.dropoffLocation.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
