import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Globe2,
  Info,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  Trees,
} from 'lucide-react';
import { useState } from 'react';
import { cityMetrics, translations } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import type { AppTab, Language } from '../../types';

export function Navbar() {
  const {
    activeTab,
    setActiveTab,
    selectedCity,
    setSelectedCity,
    language,
    setLanguage,
    setIsReportModalOpen,
  } = useAppState();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const copy = translations[language];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand Logo & Presentation Subtitle */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#14532D] text-white shadow-md shadow-green-900/20 ring-2 ring-emerald-500/20">
              <Trees className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#111827]">
                  Bio<span className="text-[#10B981]">Canopy</span>
                </span>
                <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:inline-block">
                  v2.6 Live
                </span>
              </div>
              <p className="hidden text-xs font-medium text-gray-500 md:block">
                {copy.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation View Switcher (Pill Tabs) */}
          <nav className="hidden items-center rounded-xl bg-gray-100 p-1 md:flex">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-[#14532D] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Navigation className="h-4 w-4" />
              {copy.navMap}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#14532D] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {copy.navDashboard}
            </button>

            <button
              onClick={() => setActiveTab('authority')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
                activeTab === 'authority'
                  ? 'bg-[#14532D] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              {copy.navAuthority}
            </button>
          </nav>

          {/* Right Controls: City Selector, Multi-Language, Report CTA, About */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* City Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>{selectedCity}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {isCityOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5 z-50">
                  {cityMetrics.map((city) => (
                    <button
                      key={city.city}
                      onClick={() => {
                        setSelectedCity(city.city);
                        setIsCityOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                        selectedCity === city.city
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{city.city}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          city.heatRisk === 'High'
                            ? 'bg-red-100 text-red-700'
                            : city.heatRisk === 'Moderate'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {city.temperature}°C
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
                title="Select language"
              >
                <Globe2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">
                  {languages.find((l) => l.code === language)?.native}
                </span>
                <span className="sm:hidden uppercase">{language}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5 z-50">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setIsLangOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium ${
                        language === item.code
                          ? 'bg-emerald-50 text-emerald-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.native}</span>
                      <span className="text-[10px] text-gray-400">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* "Report Hazard" Primary Action Button */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#14532D] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#166534] active:scale-95 sm:text-sm"
            >
              <AlertTriangle className="h-4 w-4 text-emerald-300" />
              <span>{copy.reportHazard}</span>
            </button>

            {/* Presentation Info / Credits */}
            <button
              onClick={() => setIsAboutOpen(true)}
              className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"
              title="Project Info & Team Credits"
            >
              <Info className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex border-t border-gray-100 bg-gray-50 px-2 py-1.5 md:hidden">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold ${
              activeTab === 'map'
                ? 'bg-white text-[#14532D] shadow-sm ring-1 ring-gray-200'
                : 'text-gray-600'
            }`}
          >
            <Navigation className="h-3.5 w-3.5" />
            {copy.navMap}
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#14532D] shadow-sm ring-1 ring-gray-200'
                : 'text-gray-600'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {copy.navDashboard}
          </button>
          <button
            onClick={() => setActiveTab('authority')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold ${
              activeTab === 'authority'
                ? 'bg-white text-[#14532D] shadow-sm ring-1 ring-gray-200'
                : 'text-gray-600'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.navAuthority}
          </button>
        </div>
      </header>

      {/* About Project & DBIT Credits Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532D] text-emerald-400">
                  <Trees className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    BioCanopy Project
                  </h3>
                  <p className="text-xs text-gray-500">
                    Urban Air Quality & Extreme Heat Resilience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs text-gray-600">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                <p className="font-semibold text-emerald-900">
                  The Bombay Salesian Society's Don Bosco Institute of Technology (DBIT)
                </p>
                <p className="mt-0.5 text-emerald-700">
                  Department of Information Technology · CEP Mini Project
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Student Contributors:</p>
                <p className="mt-1 text-gray-600">
                  Harshita Chavan, Vedika Kandalkar, Raina Dsouza, Disha Chaurasia
                </p>
                <p className="mt-1 text-gray-500">
                  Supervisor: <span className="font-medium text-gray-700">Prof. Prasad Padalkar</span> (September 9, 2026)
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="font-semibold text-gray-800">UN SDG Alignment:</p>
                <ul className="mt-1.5 list-inside list-disc space-y-1 text-gray-600">
                  <li><span className="font-medium text-emerald-800">SDG 13 (Climate Action):</span> Targets 13.1 (Adaptive Capacity) & 13.2 (Urban Policy)</li>
                  <li><span className="font-medium text-emerald-800">SDG 11 (Sustainable Cities):</span> Target 11.6 (Urban environmental impact) & 11.7</li>
                  <li><span className="font-medium text-emerald-800">SDG 3 (Good Health & Well-being):</span> Target 3.9 (Heat exhaustion & particulate avoidance)</li>
                </ul>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="font-semibold text-gray-800">Data Architecture:</p>
                <p className="mt-1 text-gray-500 leading-relaxed">
                  CPCB + IMD ground sensors and Satellite thermal imagery feed into the BioCanopy Data Engine to calculate shaded pedestrian routes, 3-band simple citizen gauges, and municipal tree-planting queues.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAboutOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#14532D] py-2.5 text-xs font-semibold text-white transition hover:bg-[#166534]"
            >
              Close Information
            </button>
          </div>
        </div>
      )}
    </>
  );
}
