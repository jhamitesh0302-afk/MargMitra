import React from 'react';
import { Truck, Heart, Globe, Shield, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span>MargMitra</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">मार्ग मित्र</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering rural producers, farmers, and village SHGs through shared vehicle pooling, transparent pricing, and smart route matching.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Safe & OTP-Verified Cargo Handover</span>
            </div>
          </div>

          {/* Quick Links for Producers */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Rural Producers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/entrepreneur" className="hover:text-emerald-400 transition-colors">Post Cargo Requirement</Link></li>
              <li><Link to="/trips" className="hover:text-emerald-400 transition-colors">Find Passing Vehicles</Link></li>
              <li><Link to="/entrepreneur" className="hover:text-emerald-400 transition-colors">Compare Freight Savings</Link></li>
              <li><Link to="/entrepreneur" className="hover:text-emerald-400 transition-colors">Mandi Delivery Schedules</Link></li>
            </ul>
          </div>

          {/* Quick Links for Transporters */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Transporters</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/transporter" className="hover:text-emerald-400 transition-colors">Publish Scheduled Route</Link></li>
              <li><Link to="/transporter" className="hover:text-emerald-400 transition-colors">Fill Empty Return Trips</Link></li>
              <li><Link to="/transporter" className="hover:text-emerald-400 transition-colors">Register Vehicle Fleet</Link></li>
              <li><Link to="/transporter" className="hover:text-emerald-400 transition-colors">Driver Payout Rates</Link></li>
            </ul>
          </div>

          {/* Community & Helpline */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Toll-Free Helpline</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>1800-MARG-MITRA (Free)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Available 6:00 AM - 9:00 PM IST in Hindi, Marathi, Kannada & Gujarati.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active in 14 Rural Clusters
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 MargMitra Technologies. Built for India's rural economic corridors.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Made with commitment for rural empowerment</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
