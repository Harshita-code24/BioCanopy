import {
  Navigation,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppState } from '../store/AppStateContext';
import { useAuth } from '../store/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const { selectedCity, reports, currentMetric, isLoadingTelemetry } = useAppState();

  const city = currentMetric;
  const pendingReports = reports.filter((r) => r.city === selectedCity).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0A1B17] p-4 sm:p-8 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                Welcome, {user?.name || 'User'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-cyan-300 ring-1 ring-cyan-500/30">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <span className="truncate max-w-[220px] xs:max-w-none">
                  {isLoadingTelemetry
                    ? 'Updating sensor telemetry...'
                    : `${city.city} Live Satellite & Ground Feed`}
                </span>
              </span>
            </div>
            <h1 className="mt-2 text-xl font-black text-white xs:text-2xl sm:text-4xl tracking-tight leading-snug">
              Urban Air Quality & Extreme Heat Resilience
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94BDB2] max-w-2xl leading-relaxed">
              BioCanopy integrates five citizen-first modules to map shaded streets, simplify open telemetry, crowdsource local hazards, and guide city greening.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-glow hover:bg-emerald-500 transition active:scale-95"
            >
              <Navigation className="h-4 w-4" />
              <span>Launch Cool-Route Map</span>
            </Link>
          </div>
        </div>

        {/* City Live Climate Pulse Bar */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 border-t border-emerald-500/20 pt-5 sm:pt-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3 sm:p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2] block truncate">
              Surface Temp
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white">{city.temperature}°C</span>
              <span className="text-[11px] sm:text-xs text-amber-400 font-bold">({city.heatRisk})</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3 sm:p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2] block truncate">
              Air Quality (AQI)
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white">{city.aqi}</span>
              <span className="text-[11px] sm:text-xs text-red-400 font-bold">AQI</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3 sm:p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2] block truncate">
              Tree Canopy Cover
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{city.treeCover}%</span>
              <span className="text-[10px] sm:text-xs text-[#94BDB2]">/ 33% goal</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3 sm:p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2] block truncate">
              Active Citizen Pins
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-300">{pendingReports}</span>
              <span className="text-[10px] sm:text-xs text-[#94BDB2]">in {selectedCity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
