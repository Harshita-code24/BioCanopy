import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  Trees,
  User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cityMetrics } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import { useAuth } from '../../store/AuthContext';
import { UserProfileModal } from '../profile/UserProfileModal';
import { ReportModal } from '../reporting/ReportModal';
import { AnimatedCanopyBackground } from '../shared/AnimatedCanopyBackground';
import { LanguageSelector } from '../shared/LanguageSelector';
import { ThemeToggle } from '../shared/ThemeToggle';

import { useTranslation } from '../../i18n/useTranslation';

export function AppLayout() {
  const { user, logout } = useAuth();
  const { selectedCity, setSelectedCity, setIsReportModalOpen, setIsProfileOpen } = useAppState();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Close city selector on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const baseNavLinks = [
    { to: '/dashboard', label: t.nav.overview, num: '00', icon: LayoutDashboard, badge: t.nav.overviewBadge },
    { to: '/map', label: t.nav.coolRoute, num: '01', icon: Navigation, badge: t.nav.coolRouteBadge },
    { to: '/open-data', label: t.nav.openData, num: '02', icon: BarChart3, badge: t.nav.openDataBadge },
    { to: '/reports', label: t.nav.citizenReporting, num: '03', icon: AlertTriangle, badge: t.nav.citizenReportingBadge },
    { to: '/advisor', label: t.nav.aiAdvisor, num: '04', icon: Sparkles, badge: t.nav.aiAdvisorBadge },
  ];

  const adminItem = {
    to: '/admin',
    label: t.nav.adminCommand,
    num: '05',
    icon: ShieldCheck,
    badge: t.nav.adminCommandBadge,
  };

  const navLinks = user?.role === 'admin' ? [...baseNavLinks, adminItem] : baseNavLinks;

  return (
    <div className="relative min-h-screen text-[#ECFDF5] flex flex-col antialiased transition-colors duration-200 overflow-x-hidden">
      {/* Dynamic Scenic Landscape with Breeze & Floating Leaves Background */}
      <AnimatedCanopyBackground />

      {/* 1. Top Bar Navigation with Toggle Menu */}
      <header className="sticky top-0 z-[1000] flex items-center justify-between border-b border-emerald-500/20 bg-[#081412]/80 px-3 py-2.5 sm:px-6 sm:py-3 backdrop-blur-xl transition-colors duration-300 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Roll-Down Curtain Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-3 py-1.5 text-xs font-bold text-white transition hover:border-emerald-400 hover:bg-emerald-500/10 shadow-sm group"
            title={isSidebarOpen ? t.nav.rollUpCanopy : t.nav.canopyMenu}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
              {isSidebarOpen ? (
                <ChevronUp className="h-3.5 w-3.5 text-emerald-300" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-emerald-300 animate-bounce" />
              )}
            </div>
            <span className="font-semibold text-white tracking-wide text-xs">
              {isSidebarOpen ? t.nav.rollUp : t.nav.menu}
            </span>
          </button>

          {/* Brand Logo in Top Bar */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow">
              <Trees className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="hidden xs:block">
              <span className="font-black text-white text-sm sm:text-base tracking-tight">
                Bio<span className="text-emerald-400">Canopy</span>
              </span>
            </div>
          </Link>

          {/* City Selector Dropdown */}
          <div className="relative" ref={cityDropdownRef}>
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-2.5 py-1.5 text-xs font-bold text-white transition hover:border-emerald-400"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span className="max-w-[70px] sm:max-w-none truncate">{selectedCity}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#94BDB2]" />
            </button>

            {isCityOpen && (
              <div className="absolute left-0 mt-2 w-44 rounded-xl border border-emerald-500/30 bg-[#0F2420] p-1 shadow-2xl z-[1002]">
                {cityMetrics.map((city) => (
                  <button
                    key={city.city}
                    onClick={() => {
                      setSelectedCity(city.city);
                      setIsCityOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${
                      selectedCity === city.city
                        ? 'bg-emerald-600 text-white'
                        : 'text-[#94BDB2] hover:bg-emerald-500/10 hover:text-white'
                    }`}
                  >
                    <span>{city.city}</span>
                    <span className="text-[10px] opacity-80">{city.temperature}°C</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side controls: Theme Toggle, Language Selector, User, Hazard Report */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Language Selector Dropdown (Hindi, Marathi, English) */}
          <LanguageSelector />

          {/* User Profile Clickable Pill (Opens Profile Modal for Neha Resident / Citizen) */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-2.5 sm:px-3 py-1.5 text-xs text-[#94BDB2] transition hover:border-emerald-400 hover:text-white hover:bg-emerald-500/10 active:scale-95 shadow-sm"
            title={`${user?.name || 'Neha Resident'} · ${t.profile.title}`}
          >
            <User className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white max-w-[70px] sm:max-w-[110px] truncate">
              {user?.name || 'Neha Resident'}
            </span>
          </button>

          {/* Quick Action: Report Hazard */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/30 shadow-sm"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t.nav.reportHazard}</span>
          </button>
        </div>
      </header>

      {/* 2. Roll-Down Curtain Canopy Navigation (Higher z-index than map & overlays) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Overlay (z-[998]) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-md"
            />

            {/* Roll-Down Curtain Container (z-[999]) */}
            <motion.div
              initial={{ y: '-100%', opacity: 0.3 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 24,
                stiffness: 220,
                mass: 0.85,
              }}
              className="fixed inset-x-0 top-[57px] z-[999] max-h-[calc(100vh-57px)] overflow-y-auto border-b-2 border-emerald-500/40 bg-[#0A1B17]/92 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(16,185,129,0.12)] backdrop-blur-2xl"
            >
              <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-7">
                {/* Curtain Header - cleanly formatted without duplicate user & roll-up pills */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow">
                      <Trees className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black tracking-tight text-white">
                          Bio<span className="text-emerald-400">Canopy</span>
                        </span>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                          {t.nav.canopyMenu}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#94BDB2]">
                        {t.common.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modules Grid inside Curtain */}
                <div className="mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94BDB2]/70 mb-3 px-1">
                    {t.nav.selectModule}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {navLinks.map(({ to, label, num, icon: Icon, badge }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between rounded-2xl border p-3.5 text-xs font-semibold transition group ${
                            isActive
                              ? 'border-emerald-400 bg-emerald-600/20 text-white shadow-glow'
                              : 'border-emerald-500/20 bg-[#0F2420]/70 text-[#94BDB2] hover:border-emerald-400/40 hover:bg-[#0F2420] hover:text-white'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#081412] text-emerald-400 ring-1 ring-emerald-500/30 group-hover:scale-110 transition">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{label}</p>
                            <p className="text-[10px] text-emerald-400/80 font-medium">{badge}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono opacity-70">
                          {num}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-emerald-500/20 pt-4">
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsProfileOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition"
                  >
                    <User className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{t.profile.title}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-500/20 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t.nav.logOut}</span>
                  </button>
                </div>

                {/* Curtain Pull Handle */}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="group flex flex-col items-center gap-1 text-[10px] font-bold text-[#94BDB2] hover:text-emerald-300 transition cursor-pointer"
                  >
                    <div className="h-1.5 w-16 rounded-full bg-emerald-500/40 group-hover:w-24 group-hover:bg-emerald-400 transition-all duration-300" />
                    <span className="flex items-center gap-1 opacity-75 group-hover:opacity-100">
                      <ChevronUp className="h-3 w-3" /> {t.nav.rollUpCanopy}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Outlet Container (Positioned above animated background) */}
      <main className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Citizen Hazard Reporting Modal */}
      <ReportModal />

      {/* Global Citizen Profile Modal */}
      <UserProfileModal />
    </div>
  );
}
