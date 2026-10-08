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
import { ReportModal } from '../reporting/ReportModal';
import { AnimatedCanopyBackground } from '../shared/AnimatedCanopyBackground';
import { LanguageSelector } from '../shared/LanguageSelector';
import { ThemeToggle } from '../shared/ThemeToggle';

export function AppLayout() {
  const { user, logout } = useAuth();
  const { selectedCity, setSelectedCity, setIsReportModalOpen, language } = useAppState();
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

  // Localized navigation titles for English, Hindi, and Marathi (Citizen Solutions)
  const localizedNav = {
    en: [
      { to: '/dashboard', label: 'Overview Dashboard', num: '00', icon: LayoutDashboard, badge: 'Hub' },
      { to: '/map', label: 'Cool-Route Map', num: '01', icon: Navigation, badge: 'Shaded 82%' },
      { to: '/open-data', label: 'Open Data Dashboard', num: '02', icon: BarChart3, badge: '3-Band Scale' },
      { to: '/reports', label: 'Citizen Reporting', num: '03', icon: AlertTriangle, badge: 'Crowdsourced' },
      { to: '/advisor', label: 'AI Safety Advisor', num: '04', icon: Sparkles, badge: 'Live Guidance' },
    ],
    hi: [
      { to: '/dashboard', label: 'अवलोकन डैशबोर्ड', num: '00', icon: LayoutDashboard, badge: 'मुख्य हब' },
      { to: '/map', label: 'शीतल मार्ग नक्शा', num: '01', icon: Navigation, badge: '८२% छायादार' },
      { to: '/open-data', label: 'ओपन डेटा डैशबोर्ड', num: '02', icon: BarChart3, badge: '३-स्तरीय पैमाना' },
      { to: '/reports', label: 'नागरिक रिपोर्टिंग', num: '03', icon: AlertTriangle, badge: 'नागरिक सहभाग' },
      { to: '/advisor', label: 'एआई सुरक्षा सलाहकार', num: '04', icon: Sparkles, badge: 'रीयल-टाइम सलाह' },
    ],
    mr: [
      { to: '/dashboard', label: 'आढावा डॅशबोर्ड', num: '00', icon: LayoutDashboard, badge: 'मुख्य केंद्र' },
      { to: '/map', label: 'शीतल मार्ग नकाशा', num: '01', icon: Navigation, badge: '८२% सावलीयुक्त' },
      { to: '/open-data', label: 'ओपन डेटा डॅशबोर्ड', num: '02', icon: BarChart3, badge: '३-स्तरीय मोजपट्टी' },
      { to: '/reports', label: 'नागरिक तक्रार नोंदणी', num: '03', icon: AlertTriangle, badge: 'लोकसहभाग' },
      { to: '/advisor', label: 'एआय सुरक्षा सल्लागार', num: '04', icon: Sparkles, badge: 'थेट मार्गदर्शन' },
    ],
  };

  const baseNavLinks = localizedNav[language] || localizedNav.en;
  const adminItem = {
    to: '/admin',
    label:
      language === 'hi'
        ? 'प्राधिकरण कमांड'
        : language === 'mr'
        ? 'प्रशासन नियंत्रण'
        : 'Authority Command',
    num: '05',
    icon: ShieldCheck,
    badge: 'Admin',
  };

  const navLinks =
    user?.role === 'admin' ? [...baseNavLinks, adminItem] : baseNavLinks;

  const uiCopy = {
    en: {
      menu: 'Menu',
      rollUp: 'Roll Up',
      reportHazard: 'Report Hazard',
      canopyMenu: 'Canopy Menu',
      tagline: 'Air quality and heat',
      selectModule: 'Select a module to navigate',
      rollUpCanopy: 'Roll up canopy',
      logOut: 'Log Out',
    },
    hi: {
      menu: 'मेन्यू',
      rollUp: 'समेटें',
      reportHazard: 'खतरे की सूचना',
      canopyMenu: 'कैनोपी मेन्यू',
      tagline: 'Air quality and heat',
      selectModule: 'नेविगेट करने के लिए मॉड्यूल चुनें',
      rollUpCanopy: 'कैनोपी समेटें',
      logOut: 'लॉग आउट',
    },
    mr: {
      menu: 'मेनू',
      rollUp: 'बंद करा',
      reportHazard: 'धोक्याची नोंद',
      canopyMenu: 'कॅनॉपी मेनू',
      tagline: 'Air quality and heat',
      selectModule: 'नेव्हिगेट करण्यासाठी विभाग निवडा',
      rollUpCanopy: 'कॅनॉपी बंद करा',
      logOut: 'लॉग आउट',
    },
  }[language] || {
    menu: 'Menu',
    rollUp: 'Roll Up',
    reportHazard: 'Report Hazard',
    canopyMenu: 'Canopy Menu',
    tagline: 'Air quality and heat',
    selectModule: 'Select a module to navigate',
    rollUpCanopy: 'Roll up canopy',
    logOut: 'Log Out',
  };

  return (
    <div className="relative min-h-screen text-[#ECFDF5] flex flex-col antialiased transition-colors duration-200 overflow-x-hidden">
      {/* Dynamic Scenic Landscape with Breeze & Floating Leaves Background */}
      <AnimatedCanopyBackground />

      {/* 1. Top Bar Navigation with Toggle Menu */}
      <header className="sticky top-0 z-[1000] flex items-center justify-between border-b border-emerald-500/20 bg-[#081412]/85 px-2.5 py-2 sm:px-6 sm:py-3 backdrop-blur-xl transition-colors duration-300 shadow-sm">
        <div className="flex items-center gap-1.5 sm:gap-3.5">
          {/* Roll-Down Curtain Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-2.5 py-1.5 text-xs font-bold text-white transition hover:border-emerald-400 hover:bg-emerald-500/10 shadow-sm group active:scale-95"
            title={isSidebarOpen ? 'Roll up canopy menu' : 'Roll down canopy menu'}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
              {isSidebarOpen ? (
                <ChevronUp className="h-3.5 w-3.5 text-emerald-300" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-emerald-300 animate-bounce" />
              )}
            </div>
            <span className="font-semibold text-white tracking-wide text-xs">
              {isSidebarOpen ? uiCopy.rollUp : uiCopy.menu}
            </span>
          </button>

          {/* Brand Logo in Top Bar */}
          <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow">
              <Trees className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            </div>
            <div className="hidden xs:block">
              <span className="font-black text-white text-xs sm:text-base tracking-tight">
                Bio<span className="text-emerald-400">Canopy</span>
              </span>
            </div>
          </Link>

          {/* City Selector Dropdown */}
          <div className="relative" ref={cityDropdownRef}>
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1 sm:gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-2 py-1.5 text-xs font-bold text-white transition hover:border-emerald-400 active:scale-95"
              title="Change City"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="max-w-[55px] xs:max-w-[75px] sm:max-w-none truncate">{selectedCity}</span>
              <ChevronDown className="h-3 w-3 text-[#94BDB2] shrink-0" />
            </button>

            {isCityOpen && (
              <div className="absolute left-0 mt-2 w-44 rounded-xl border border-emerald-500/30 bg-[#0F2420] p-1 shadow-2xl z-[1002] backdrop-blur-xl">
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
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Language Selector Dropdown (Responsive Compact Pill on mobile) */}
          <LanguageSelector />

          {/* User Profile Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-[#0F2420] px-3 py-1.5 text-xs text-[#94BDB2]">
            <User className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-medium text-white max-w-[90px] truncate">{user?.name || 'User'}</span>
          </div>

          {/* Quick Action: Report Hazard */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-2 sm:px-3 py-1.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/30 shadow-sm active:scale-95"
            title={uiCopy.reportHazard}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">{uiCopy.reportHazard}</span>
          </button>
        </div>
      </header>

      {/* 2. Roll-Down Curtain Canopy Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-md"
            />

            {/* Roll-Down Curtain Container */}
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
              className="fixed inset-x-0 top-[52px] sm:top-[57px] z-[999] max-h-[calc(100vh-52px)] sm:max-h-[calc(100vh-57px)] overflow-y-auto border-b-2 border-emerald-500/40 bg-[#0A1B17]/95 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(16,185,129,0.12)] backdrop-blur-2xl"
            >
              <div className="mx-auto max-w-5xl px-3.5 py-5 sm:px-6 sm:py-7">
                {/* Curtain Header */}
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow">
                      <Trees className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-black tracking-tight text-white">
                          Bio<span className="text-emerald-400">Canopy</span>
                        </span>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                          {uiCopy.canopyMenu}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs font-semibold text-[#94BDB2]">
                        {uiCopy.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* User Profile Pill in Curtain */}
                    <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-emerald-500/20 bg-[#0F2420] px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs text-[#94BDB2]">
                      <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400" />
                      <span className="font-bold text-white text-[11px] sm:text-xs max-w-[80px] sm:max-w-none truncate">{user?.name || 'User'}</span>
                      <span className="hidden sm:inline text-[10px] uppercase text-emerald-400 font-semibold">({user?.role === 'admin' ? 'Admin' : 'Citizen'})</span>
                    </div>

                    {/* Roll Up Button */}
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition shadow-sm active:scale-95"
                      title="Roll Up Menu"
                    >
                      <ChevronUp className="h-4 w-4" />
                      <span className="hidden xs:inline">{uiCopy.rollUp}</span>
                    </button>
                  </div>
                </div>

                {/* Modules Grid inside Curtain */}
                <div className="mt-4 sm:mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94BDB2]/70 mb-2.5 px-1">
                    {uiCopy.selectModule}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                    {navLinks.map(({ to, label, num, icon: Icon, badge }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between rounded-2xl border p-3 sm:p-3.5 text-xs font-semibold transition group active:scale-[0.98] ${
                            isActive
                              ? 'border-emerald-400 bg-emerald-600/25 text-white shadow-glow'
                              : 'border-emerald-500/20 bg-[#0F2420]/75 text-[#94BDB2] hover:border-emerald-400/40 hover:bg-[#0F2420] hover:text-white'
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
                <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between border-t border-emerald-500/20 pt-4">
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsReportModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition active:scale-95"
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{uiCopy.reportHazard}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition active:scale-95"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                    <span>{uiCopy.logOut}</span>
                  </button>
                </div>

                {/* Curtain Pull Handle */}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="group flex flex-col items-center gap-1 text-[10px] font-bold text-[#94BDB2] hover:text-emerald-300 transition cursor-pointer py-1"
                  >
                    <div className="h-1.5 w-16 rounded-full bg-emerald-500/40 group-hover:w-24 group-hover:bg-emerald-400 transition-all duration-300" />
                    <span className="flex items-center gap-1 opacity-75 group-hover:opacity-100">
                      <ChevronUp className="h-3 w-3" /> {uiCopy.rollUpCanopy}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Outlet Container (Positioned above animated background) */}
      <main className="relative z-10 flex-1 p-3 xs:p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
    </div>
  );
}
