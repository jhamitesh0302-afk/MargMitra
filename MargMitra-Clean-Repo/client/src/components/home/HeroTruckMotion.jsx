import React from 'react';
import { MapPin, Users, ShieldCheck } from 'lucide-react';

export default function HeroTruckMotion() {
  // Curved route path tracing the asphalt highway curve in the scenic background photograph
  const pathD = "M 430 40 C 340 120, 240 210, 220 310 C 200 390, 230 440, 280 495";

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[470px] overflow-visible">
      {/* Floating Status Card matching Reference Design */}
      <div className="absolute top-2 right-2 sm:right-6 z-20 bg-[#07241C]/85 backdrop-blur-md border border-[#63B98A]/35 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl max-w-[260px] transition-all hover:scale-105">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#63B98A]/20 flex items-center justify-center text-[#63B98A] shrink-0 border border-[#63B98A]/40 mt-0.5">
            <MapPin className="w-5 h-5 text-[#63B98A]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block">
              Shared Trip Available
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>Pune</span>
              <span className="text-[#63B98A]">→</span>
              <span>Nashik</span>
            </div>
            <div className="text-[11px] text-[#A7E4BF] font-semibold flex items-center gap-1.5 mt-1">
              <Users className="w-3 h-3 text-[#63B98A]" />
              <span>2 seats</span>
              <span className="text-white/40">•</span>
              <span>400 kg space</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent SVG Canvas overlaying directly on top of the road in hero-bg.jpg */}
      <svg
        className="w-full h-full overflow-visible pointer-events-none"
        viewBox="0 0 600 520"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Luminous route glow filter */}
          <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Realistic Indian Logistics Truck Symbol */}
          <g id="heroLogisticsTruck">
            {/* Soft ground shadow under vehicle */}
            <ellipse cx="0" cy="18" rx="36" ry="8" fill="#000000" opacity="0.5" />

            {/* Cargo Box (White / Emerald green band) */}
            <rect x="-34" y="-18" width="44" height="26" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            {/* Emerald logistics banner */}
            <rect x="-32" y="-16" width="40" height="5" fill="#0B5D4A" rx="1" />
            <line x1="-14" y1="-14" x2="-14" y2="7" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="0" y1="-14" x2="0" y2="7" stroke="#E2E8F0" strokeWidth="1" />

            {/* Truck Cabin (White with tinted windshield) */}
            <path
              d="M 10 -16 L 24 -16 L 30 -7 L 30 8 L 10 8 Z"
              fill="#F8FAFC"
              stroke="#94A3B8"
              strokeWidth="1"
            />
            {/* Tinted Windshield */}
            <path d="M 12 -14 L 22 -14 L 27 -7 L 12 -7 Z" fill="#38BDF8" opacity="0.85" />
            {/* Headlight beam */}
            <polygon points="30,-4 65,-12 65,12 30,6" fill="url(#truckBeam)" opacity="0.4" />

            {/* Wheels with chrome rims */}
            <g className="truck-wheel">
              <circle cx="-22" cy="11" r="5.5" fill="#0F172A" />
              <circle cx="-22" cy="11" r="2.5" fill="#94A3B8" />
            </g>
            <g className="truck-wheel">
              <circle cx="-6" cy="11" r="5.5" fill="#0F172A" />
              <circle cx="-6" cy="11" r="2.5" fill="#94A3B8" />
            </g>
            <g className="truck-wheel">
              <circle cx="22" cy="11" r="5.5" fill="#0F172A" />
              <circle cx="22" cy="11" r="2.5" fill="#94A3B8" />
            </g>
          </g>

          <linearGradient id="truckBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Luminous Dashed Route Line Tracing the Highway */}
        <path
          d={pathD}
          fill="none"
          stroke="#63B98A"
          strokeWidth="3.5"
          strokeDasharray="9 7"
          className="animated-route-dash"
          filter="url(#routeGlow)"
          opacity="0.9"
        />

        {/* 2. Route Start / Origin Marker (Pune Rural Hub) */}
        <g transform="translate(430, 40)">
          <circle cx="0" cy="0" r="16" fill="#63B98A" className="pulse-ring" />
          <circle cx="0" cy="0" r="7" fill="#0B5D4A" stroke="#FFFFFF" strokeWidth="2" />
        </g>

        {/* 3. Route Destination Marker (Nashik APMC Mandi) */}
        <g transform="translate(280, 495)">
          <circle cx="0" cy="0" r="16" fill="#EF4444" className="pulse-ring" />
          <circle cx="0" cy="0" r="7" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
        </g>

        {/* 4. MOVING TRUCK: Smooth animated movement along the curved road */}
        <g>
          <use href="#heroLogisticsTruck">
            <animateMotion
              path={pathD}
              dur="10s"
              repeatCount="indefinite"
              rotate="auto"
              keyTimes="0; 0.08; 0.92; 1"
              keyPoints="0; 0.04; 0.96; 1"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </use>
        </g>
      </svg>
    </div>
  );
}
