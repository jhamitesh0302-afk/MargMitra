import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Truck, Package, ShieldCheck, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

import loginBg from '../assets/login-bg.jpg';

export default function LoginPage() {
  const { login, demoLogin, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState('ENTREPRENEUR'); // 'ENTREPRENEUR' | 'TRANSPORTER'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(phone, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'ENTREPRENEUR') {
        navigate('/entrepreneur');
      } else {
        navigate('/transporter');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      addToast(err.message || 'Login failed', 'error');
    }
  };

  const handleQuickDemo = (role) => {
    const user = demoLogin(role);
    addToast(`Logged in as demo ${role === 'ENTREPRENEUR' ? 'Producer' : 'Transporter'}`, 'info');
    if (user.role === 'ENTREPRENEUR') {
      navigate('/entrepreneur');
    } else {
      navigate('/transporter');
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#E6ECE8] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Brand Panel (Matching Screen 2 in Design System) */}
        <div className="md:col-span-5 relative text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Background image of tractor in rural farm field */}
          <img
            src={loginBg}
            alt="Rural transport tractor in Maharashtra farm"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark green overlay matching Screen 2 in reference image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#062920]/90 via-[#062920]/80 to-[#041D17]/95" />

          <div className="space-y-4 relative z-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Truck className="w-5 h-5 text-[#63B98A]" />
              </div>
              <span className="text-xl font-bold tracking-tight">MargMitra</span>
            </Link>

            <div className="pt-8">
              <h2 className="text-2xl font-bold tracking-tight mt-1 leading-snug">
                Empowering Rural Entrepreneurs
              </h2>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Reliable transport. Stronger communities. A better tomorrow.
              </p>
            </div>
          </div>

          {/* Rural Graphic Representation */}
          <div className="pt-8 relative z-10">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#DDF3E7]">
                <ShieldCheck className="w-4 h-4 text-[#63B98A]" />
                <span>100% Verified Village Routes</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Active corridors across Maharashtra with OTP-secured cargo transfer.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-[#12212B]">Welcome Back</h3>
            <p className="text-xs text-[#68756F]">Login to your MargMitra logistics account</p>
          </div>

          {/* Role Switch Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F7F8F5] border border-slate-200">
            <button
              type="button"
              onClick={() => setRoleTab('ENTREPRENEUR')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                roleTab === 'ENTREPRENEUR'
                  ? 'bg-[#0B5D4A] text-white shadow-xs'
                  : 'text-[#68756F] hover:text-[#12212B]'
              }`}
            >
              Entrepreneur / Farmer
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('TRANSPORTER')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                roleTab === 'TRANSPORTER'
                  ? 'bg-[#0B5D4A] text-white shadow-xs'
                  : 'text-[#68756F] hover:text-[#12212B]'
              }`}
            >
              Transport Owner
            </button>
          </div>

          {/* 1-Click Evaluation Demo Switcher */}
          <div className="p-3 rounded-xl bg-[#DDF3E7]/40 border border-[#63B98A]/40 flex items-center justify-between text-xs">
            <div className="text-[11px] text-[#0B5D4A] font-medium">Quick 1-Click Demo:</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('ENTREPRENEUR')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#0B5D4A]/20 hover:bg-[#DDF3E7] text-[#0B5D4A] font-semibold text-[11px] transition-all"
              >
                Ramesh (Farmer)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('TRANSPORTER')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#0B5D4A]/20 hover:bg-[#DDF3E7] text-[#0B5D4A] font-semibold text-[11px] transition-all"
              >
                Balwant (Driver)
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#12212B] mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:border-[#0B5D4A] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12212B] mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4A] focus:border-[#0B5D4A] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#68756F]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0B5D4A] focus:ring-[#0B5D4A]"
                />
                <span>Remember me</span>
              </label>
              <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Forgot password?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0B5D4A] hover:bg-[#073B32] text-white font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#68756F]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#0B5D4A] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
