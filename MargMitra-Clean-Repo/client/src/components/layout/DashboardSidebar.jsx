import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PackagePlus,
  Package,
  Bookmark,
  MessageSquare,
  User,
  HelpCircle,
  LogOut,
  Truck,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function DashboardSidebar({ onOpenCreateDelivery, activeTab, setActiveTab }) {
  const { user, logout, isEntrepreneur, isTransporter, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: isEntrepreneur ? 'Create Delivery' : 'Schedule Route', icon: PackagePlus, isAction: true },
    { id: 'requests', label: isEntrepreneur ? 'My Requests' : 'Active Manifest', icon: Package },
    { id: 'trips', label: 'Explore Routes', icon: Bookmark, link: '/trips' },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleNavClick = (item) => {
    if (item.link) {
      navigate(item.link);
      setMobileOpen(false);
      return;
    }

    if (item.isAction && onOpenCreateDelivery) {
      onOpenCreateDelivery();
      setMobileOpen(false);
      return;
    }

    if (setActiveTab) {
      setActiveTab(item.id);
    }
    setMobileOpen(false);
  };

  const handleDemoToggle = () => {
    if (isEntrepreneur) {
      demoLogin('TRANSPORTER');
      navigate('/transporter');
    } else {
      demoLogin('ENTREPRENEUR');
      navigate('/entrepreneur');
    }
  };

  return (
    <>
      {/* Mobile Top Bar with Hamburger for Sidebar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0B5D4A] flex items-center justify-center text-white">
            <Truck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-[#12212B]">
            {isEntrepreneur ? 'Farmer Portal' : 'Transporter Hub'}
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-[#E6ECE8] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo & App Tagline */}
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B5D4A] flex items-center justify-center text-white shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-[#12212B] tracking-tight leading-tight">
                MargMitra
              </div>
              <div className="text-[10px] text-[#68756F] font-medium leading-none">
                Rural Transport. Shared Growth.
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-4 flex-1 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#68756F]">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0B5D4A] text-white shadow-xs'
                    : 'text-[#68756F] hover:text-[#12212B] hover:bg-[#F7F8F5]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#68756F]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Role Indicator, Help & Support, Logout */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* Active Role Card & Switcher */}
          <div className="p-2.5 rounded-xl bg-[#F7F8F5] border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#68756F]">Active Profile:</span>
              <span className="font-bold text-[#0B5D4A] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#63B98A]" />
                {isEntrepreneur ? 'Farmer' : 'Transporter'}
              </span>
            </div>
            <button
              onClick={handleDemoToggle}
              className="w-full text-center py-1 text-[10px] font-semibold text-[#0B5D4A] bg-white rounded-lg border border-[#0B5D4A]/20 hover:bg-[#DDF3E7] transition-all"
            >
              Switch to {isEntrepreneur ? 'Transporter' : 'Farmer'}
            </button>
          </div>

          <div className="space-y-0.5">
            <a
              href="#support"
              onClick={(e) => { e.preventDefault(); alert('Helpline: 1800-MARG-MITRA (Free 6am-9pm IST)'); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#68756F] hover:text-[#12212B] hover:bg-[#F7F8F5] rounded-lg transition-colors font-medium"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help & Support</span>
            </a>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        ></div>
      )}
    </>
  );
}
