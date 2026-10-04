import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Truck, Package, ShieldCheck, Phone, User, Lock, MapPin, ArrowRight } from 'lucide-react';
import loginBg from '../assets/login-bg.jpg';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('ENTREPRENEUR');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register({
        name,
        phone,
        role,
        village,
        district,
        state: 'Maharashtra',
        password
      });

      addToast(`Account created successfully! Welcome, ${user.name}`, 'success');
      if (user.role === 'ENTREPRENEUR') {
        navigate('/entrepreneur');
      } else {
        navigate('/transporter');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      addToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#E6ECE8] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Brand Panel */}
        <div className="md:col-span-5 relative text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Background image of tractor in rural farm field */}
          <img
            src={loginBg}
            alt="Rural transport tractor in Maharashtra farm"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark green overlay matching Screen 2 in reference image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#062920]/92 via-[#062920]/80 to-[#041D17]/95" />

          <div className="space-y-4 relative z-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Truck className="w-5 h-5 text-[#63B98A]" />
              </div>
              <span className="text-xl font-bold tracking-tight">MargMitra</span>
            </Link>

            <div className="pt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#63B98A]">Start Moving Goods</span>
              <h2 className="text-2xl font-bold tracking-tight mt-1 leading-snug">
                Join Maharashtra's Shared Transport Network
              </h2>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Connect your farm, dairy, or handloom business directly with returning vehicles and scheduled corridors.
              </p>
            </div>
          </div>

          <div className="pt-8 relative z-10 space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-xs text-[#DDF3E7]">
              <ShieldCheck className="w-4 h-4 text-[#63B98A] shrink-0" />
              <span>Zero Middlemen • Transparent Shared Rates</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-5">
          <div>
            <h3 className="text-2xl font-bold text-[#12212B]">Create Your Account</h3>
            <p className="text-xs text-[#68756F]">Select your role to get started</p>
          </div>

          {/* Role Toggle Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F7F8F5] border border-slate-200">
            <button
              type="button"
              onClick={() => setRole('ENTREPRENEUR')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                role === 'ENTREPRENEUR'
                  ? 'bg-[#0B5D4A] text-white shadow-xs'
                  : 'text-[#68756F] hover:text-[#12212B]'
              }`}
            >
              Producer / Farmer
            </button>
            <button
              type="button"
              onClick={() => setRole('TRANSPORTER')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                role === 'TRANSPORTER'
                  ? 'bg-[#0B5D4A] text-white shadow-xs'
                  : 'text-[#68756F] hover:text-[#12212B]'
              }`}
            >
              Transport Owner
            </button>
          </div>

          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#12212B] mb-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12212B] mb-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#12212B] mb-1">Village / Taluka</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Niphad"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#12212B] mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                >
                  <option value="Nashik">Nashik</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Satara">Satara</option>
                  <option value="Mumbai Suburban">Mumbai / Vashi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12212B] mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0B5D4A] hover:bg-[#073B32] text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#68756F]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0B5D4A] hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
