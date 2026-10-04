import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroTruckMotion from '../components/home/HeroTruckMotion';
import heroBg from '../assets/hero-bg.jpg';
import {
  Truck,
  Package,
  TrendingDown,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Coins,
  ChevronRight,
  PhoneCall,
  Search,
  Layers,
  Award,
  Navigation2,
  Calendar,
  Zap,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  // Freight Calculator State
  const [weight, setWeight] = useState(350); // kg
  const [distance, setDistance] = useState(140); // km

  const soloHireCost = Math.round(500 + distance * 18);
  const sharedCost = Math.round(Math.max(250, weight * distance * 0.008 + 120));
  const savings = Math.max(0, soloHireCost - sharedCost);
  const savingsPercent = Math.round((savings / soloHireCost) * 100);

  const handleStartAsFarmer = () => {
    demoLogin('ENTREPRENEUR');
    navigate('/entrepreneur');
  };

  const handleStartAsTransporter = () => {
    demoLogin('TRANSPORTER');
    navigate('/transporter');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION WITH SCENIC MOUNTAIN ROAD BACKGROUND IMAGE */}
      <section className="relative overflow-hidden bg-[#051C15] text-white">
        {/* Full-bleed Scenic Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={heroBg}
            alt="Scenic Maharashtra Western Ghats rural transport highway"
            className="w-full h-full object-cover object-[70%_center] lg:object-center brightness-[0.92] contrast-[1.05]"
          />
          {/* Deep dark gradient overlay on the left for crisp white typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041A14] via-[#041A14]/92 via-40% sm:via-[#041A14]/75 to-transparent" />
          {/* Subtle top & bottom dark vignetting */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#041A14]/50 via-transparent to-[#041A14]/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 sm:pt-14 sm:pb-32 lg:pt-16 lg:pb-36 min-h-[560px] lg:min-h-[620px] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            {/* Left Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDF3E7]/15 backdrop-blur-xs text-[#A7E4BF] text-xs font-semibold tracking-wide border border-[#63B98A]/30">
                <span className="w-2 h-2 rounded-full bg-[#63B98A] animate-pulse"></span>
                <span>Rural Logistics & Route Sharing Platform • Maharashtra</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                Find Transport.<br />
                Share the Journey.<br />
                <span className="text-[#63B98A]">Move Your Goods.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                MargMitra connects rural entrepreneurs with available transport and shared trips, helping you move goods faster, cheaper and further — together.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/trips"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0B5D4A] hover:bg-[#0E7A61] text-white font-semibold text-sm shadow-xl hover:shadow-2xl transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/30 backdrop-blur-xs shadow-xs transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-[#63B98A] fill-[#63B98A]" />
                  <span>Watch How It Works</span>
                </a>
              </div>

              {/* Verified Trust Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/15 text-left">
                <div>
                  <div className="text-2xl font-bold text-white">55%+</div>
                  <div className="text-xs text-slate-300 font-medium">Avg. Cost Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#63B98A]">0</div>
                  <div className="text-xs text-slate-300 font-medium">Empty Return Trips</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-slate-300 font-medium">OTP Verified Handover</div>
                </div>
              </div>
            </div>

            {/* Right Moving Truck Visual Component (Transparent Overlay over the Scenic Road) */}
            <div className="lg:col-span-5 w-full">
              <HeroTruckMotion />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR BENEFIT PILLARS (Matching Reference Card Strip) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Pillar 1 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4 first:px-0">
              <div className="w-11 h-11 rounded-xl bg-[#DDF3E7] text-[#0B5D4A] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#12212B]">More Vehicles</h4>
                <p className="text-xs text-[#68756F] mt-0.5">Find verified transport options</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-11 h-11 rounded-xl bg-[#DDF3E7] text-[#0B5D4A] flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#12212B]">Lower Costs</h4>
                <p className="text-xs text-[#68756F] mt-0.5">Share trips &amp; reduce expenses</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-11 h-11 rounded-xl bg-[#DDF3E7] text-[#0B5D4A] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#12212B]">Trusted Community</h4>
                <p className="text-xs text-[#68756F] mt-0.5">Verified drivers &amp; vehicle owners</p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-11 h-11 rounded-xl bg-[#DDF3E7] text-[#0B5D4A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#12212B]">Rural Focus</h4>
                <p className="text-xs text-[#68756F] mt-0.5">Built for local entrepreneurs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS TIMELINE */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B5D4A]">Simple Logistics Journey</span>
          <h2 className="text-3xl font-extrabold text-[#12212B]">How MargMitra Works</h2>
          <p className="text-sm text-[#68756F]">
            From farm gate to wholesale mandi in 5 transparent, verified steps.
          </p>
        </div>

        {/* Visual Timeline (Horizontal on desktop, vertical on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs relative space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0B5D4A] text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm text-[#12212B]">Enter Delivery Details</h4>
            <p className="text-xs text-[#68756F] leading-relaxed">
              Specify your goods, weight (kg or crates), pickup village, and destination mandi.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs relative space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0B5D4A] text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm text-[#12212B]">Find Transport</h4>
            <p className="text-xs text-[#68756F] leading-relaxed">
              Our routing engine scans passing vehicles scheduled on that exact highway route.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs relative space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0B5D4A] text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm text-[#12212B]">Compare Options</h4>
            <p className="text-xs text-[#68756F] leading-relaxed">
              Review vehicle types, verified driver ratings, departure times, and transparent rates.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs relative space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0B5D4A] text-white text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-sm text-[#12212B]">Request to Join</h4>
            <p className="text-xs text-[#68756F] leading-relaxed">
              Reserve spare capacity with 1-click. Receive a 4-digit handover OTP for peace of mind.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-5 rounded-2xl border border-[#E6ECE8] shadow-2xs relative space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0B5D4A] text-white text-xs font-bold flex items-center justify-center">
              5
            </div>
            <h4 className="font-bold text-sm text-[#12212B]">Move Goods</h4>
            <p className="text-xs text-[#68756F] leading-relaxed">
              Driver picks up from your gate, delivers directly to market, and verifies delivery OTP.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TRANSPORT CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0B5D4A]">Tailored for Rural Needs</span>
          <h2 className="text-3xl font-extrabold text-[#12212B]">Vehicle Categories</h2>
          <p className="text-sm text-[#68756F]">
            Every vehicle on the platform is suited for real Indian rural roads and agricultural produce.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Category 1 */}
          <div className="bg-white p-4 rounded-xl border border-[#E6ECE8] text-center space-y-2 shadow-2xs hover:border-[#63B98A] transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F7F8F5] flex items-center justify-center text-2xl">
              🛺
            </div>
            <h4 className="font-bold text-xs text-[#12212B]">Auto Carrier</h4>
            <p className="text-[11px] text-[#68756F]">Up to 350 kg</p>
            <span className="inline-block text-[10px] font-semibold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-full">
              Local mandi trips
            </span>
          </div>

          {/* Category 2 */}
          <div className="bg-white p-4 rounded-xl border border-[#E6ECE8] text-center space-y-2 shadow-2xs hover:border-[#63B98A] transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F7F8F5] flex items-center justify-center text-2xl">
              🚐
            </div>
            <h4 className="font-bold text-xs text-[#12212B]">Tempo / Chhota Hathi</h4>
            <p className="text-[11px] text-[#68756F]">Up to 750 kg</p>
            <span className="inline-block text-[10px] font-semibold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-full">
              Vegetable crates
            </span>
          </div>

          {/* Category 3 */}
          <div className="bg-white p-4 rounded-xl border border-[#E6ECE8] text-center space-y-2 shadow-2xs hover:border-[#63B98A] transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F7F8F5] flex items-center justify-center text-2xl">
              🛻
            </div>
            <h4 className="font-bold text-xs text-[#12212B]">Pickup (Bolero Maxi)</h4>
            <p className="text-[11px] text-[#68756F]">Up to 1.5 Ton</p>
            <span className="inline-block text-[10px] font-semibold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-full">
              High speed corridor
            </span>
          </div>

          {/* Category 4 */}
          <div className="bg-white p-4 rounded-xl border border-[#E6ECE8] text-center space-y-2 shadow-2xs hover:border-[#63B98A] transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F7F8F5] flex items-center justify-center text-2xl">
              🚜
            </div>
            <h4 className="font-bold text-xs text-[#12212B]">Tractor-Trolley</h4>
            <p className="text-[11px] text-[#68756F]">Up to 3.5 Ton</p>
            <span className="inline-block text-[10px] font-semibold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-full">
              Grains & Sugarcane
            </span>
          </div>

          {/* Category 5 */}
          <div className="bg-white p-4 rounded-xl border border-[#E6ECE8] text-center space-y-2 shadow-2xs hover:border-[#63B98A] transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F7F8F5] flex items-center justify-center text-2xl">
              🚚
            </div>
            <h4 className="font-bold text-xs text-[#12212B]">Mini Truck (Eicher)</h4>
            <p className="text-[11px] text-[#68756F]">Up to 4.0 Ton</p>
            <span className="inline-block text-[10px] font-semibold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-full">
              Inter-district goods
            </span>
          </div>

          {/* Category 6 */}
          <div className="bg-white p-4 rounded-xl border border-[#E6ECE8] text-center space-y-2 shadow-2xs hover:border-[#63B98A] transition-all">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#F7F8F5] flex items-center justify-center text-2xl">
              🚛
            </div>
            <h4 className="font-bold text-xs text-[#12212B]">Heavy Truck</h4>
            <p className="text-[11px] text-[#68756F]">9 to 16 Ton</p>
            <span className="inline-block text-[10px] font-semibold text-[#0B5D4A] bg-[#DDF3E7] px-2 py-0.5 rounded-full">
              Bulk mandi dispatch
            </span>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FREIGHT SAVINGS CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B5D4A] rounded-3xl text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#63B98A]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF3E7]/20 text-[#DDF3E7] text-xs font-semibold">
                <Coins className="w-3.5 h-3.5" />
                <span>Transparent Freight Savings Calculator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Calculate Exactly How Much You Save per Trip
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Why pay full-day private rental for a 1-ton vehicle just to transport 3 quintals of produce? Share space and pay only for your exact payload.
              </p>

              {/* Sliders */}
              <div className="space-y-5 pt-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-200">Cargo Weight:</span>
                    <span className="font-bold text-[#63B98A] text-sm">{weight} kg ({Math.round(weight / 100 * 10) / 10} Quintals)</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2 bg-[#073B32] rounded-lg appearance-none cursor-pointer accent-[#63B98A]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                    <span>50 kg</span>
                    <span>750 kg</span>
                    <span>1,500 kg</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-200">Distance to Mandi / Destination:</span>
                    <span className="font-bold text-[#63B98A] text-sm">{distance} Kilometers</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="350"
                    step="10"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full h-2 bg-[#073B32] rounded-lg appearance-none cursor-pointer accent-[#63B98A]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                    <span>20 km (Local)</span>
                    <span>180 km (District)</span>
                    <span>350 km (Metro)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Comparison Box */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Cost Comparison</h3>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/10">
                  <div>
                    <div className="text-xs text-slate-300">Solo Vehicle Full Hire</div>
                    <div className="text-[10px] text-rose-300">Whole truck reserved</div>
                  </div>
                  <div className="text-lg font-bold text-slate-300 line-through">₹{soloHireCost.toLocaleString()}</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-[#DDF3E7]/20 border border-[#63B98A]/50">
                  <div>
                    <div className="text-xs text-[#DDF3E7] font-bold">MargMitra Shared Space</div>
                    <div className="text-[10px] text-[#DDF3E7]/80">Only {weight} kg payload</div>
                  </div>
                  <div className="text-2xl font-extrabold text-[#63B98A]">₹{sharedCost.toLocaleString()}</div>
                </div>
              </div>

              {/* Total Savings Highlight */}
              <div className="p-4 rounded-xl bg-white text-[#12212B] text-center space-y-0.5 shadow-lg">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#0B5D4A]">Net Savings for Your Farm / Business</div>
                <div className="text-2xl font-extrabold text-[#0B5D4A]">₹{savings.toLocaleString()} ({savingsPercent}% Off)</div>
              </div>

              <Link
                to="/trips"
                className="w-full py-3 rounded-full bg-[#63B98A] hover:bg-[#52a677] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Find Shared Transport Options</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
