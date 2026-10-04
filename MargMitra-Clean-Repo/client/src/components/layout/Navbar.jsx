import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Truck, Package, MapPin, User, LogOut, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout, demoLogin, isAuthenticated, isEntrepreneur } = useAuth();
  const { addToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = (role) => {
    demoLogin(role);
    setMobileMenuOpen(false);
    addToast(`Switched to demo ${role === 'ENTREPRENEUR' ? 'Farmer' : 'Transporter'}`, 'info');
    if (role === 'ENTREPRENEUR') {
      navigate('/entrepreneur');
    } else {
      navigate('/transporter');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#06221A]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo matching Reference Image */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0B5D4A] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform border border-[#63B98A]/30">
              <Truck className="w-5 h-5 text-[#A7E4BF]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-extrabold tracking-tight text-white">Marg<span className="text-[#63B98A]">Mitra</span></span>
              </div>
              <p className="text-[10px] text-[#A7E4BF] font-semibold mt-0.5">Rural Transport. Shared Growth.</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/') ? 'text-white bg-[#0B5D4A] shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link
              to="/trips"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/trips') ? 'text-white bg-[#0B5D4A] shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Find Transport
            </Link>
            <Link
              to="/entrepreneur"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/entrepreneur') ? 'text-white bg-[#0B5D4A] shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Producer Portal
            </Link>
            <Link
              to="/transporter"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/transporter') ? 'text-white bg-[#0B5D4A] shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Transporter Hub
            </Link>
          </nav>

          {/* Right Action & Demo Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-xs font-medium border border-white/15">
              <span className="text-slate-300 px-1 text-[11px]">Demo:</span>
              <button
                type="button"
                onClick={() => handleDemoSwitch('ENTREPRENEUR')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  user?.role === 'ENTREPRENEUR'
                    ? 'bg-[#0B5D4A] text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('TRANSPORTER')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  user?.role === 'TRANSPORTER'
                    ? 'bg-[#0B5D4A] text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Driver
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/15">
                <div className="text-right">
                  <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                  <div className="text-[10px] font-semibold text-[#A7E4BF] flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#63B98A]" />
                    {user.role === 'ENTREPRENEUR' ? 'Producer' : 'Transporter'}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white border border-white/25 hover:border-white/50 rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0B5D4A] hover:bg-[#0E7A61] rounded-full shadow-xs transition-all border border-[#63B98A]/30"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#06221A] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              to="/trips"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Find Transport
            </Link>
            <Link
              to="/entrepreneur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Producer Portal
            </Link>
            <Link
              to="/transporter"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Transporter Hub
            </Link>
          </div>

          {/* Mobile Demo Selector */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-[11px] font-bold text-slate-400 mb-2">Switch Demo Role:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoSwitch('ENTREPRENEUR')}
                className="py-2 text-xs font-bold rounded-xl border border-white/15 bg-white/10 text-white hover:bg-[#0B5D4A]"
              >
                Farmer Profile
              </button>
              <button
                onClick={() => handleDemoSwitch('TRANSPORTER')}
                className="py-2 text-xs font-bold rounded-xl border border-white/15 bg-white/10 text-white hover:bg-[#0B5D4A]"
              >
                Transporter Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
