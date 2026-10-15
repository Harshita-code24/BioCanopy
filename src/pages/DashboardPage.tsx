import {
  Navigation,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n/useTranslation';
import { useAppState } from '../store/AppStateContext';
import { useAuth } from '../store/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const { selectedCity, reports, currentMetric, isLoadingTelemetry } = useAppState();
  const { t } = useTranslation();

  const city = currentMetric;
  const pendingReports = reports.filter((r) => r.city === selectedCity).length;

  const heatRiskLabel =
    city.heatRisk === 'High'
      ? t.dashboard.highRisk
      : city.heatRisk === 'Moderate'
      ? t.dashboard.moderateRisk
      : t.dashboard.lowRisk;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0A1B17] p-6 sm:p-8 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                {t.common.welcome}, {user?.name || t.common.citizen}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 ring-1 ring-cyan-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <span>
                  {isLoadingTelemetry
                    ? t.dashboard.updatingSensors
                    : `${city.city} ${t.dashboard.liveSensorFeed}`}
                </span>
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-4xl tracking-tight">
              {t.dashboard.welcomeBannerTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#94BDB2] max-w-2xl leading-relaxed">
              {t.dashboard.welcomeBannerDesc}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-glow hover:bg-emerald-500 transition"
            >
              <Navigation className="h-4 w-4" />
              <span>{t.dashboard.launchCoolRoute}</span>
            </Link>
          </div>
        </div>

        {/* City Live Climate Pulse Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-emerald-500/20 pt-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {t.dashboard.surfaceTemp}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{city.temperature}°C</span>
              <span className="text-xs text-amber-400 font-bold">({heatRiskLabel})</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {t.dashboard.airQualityIndex}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{city.aqi}</span>
              <span className="text-xs text-red-400 font-bold">AQI</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {t.dashboard.urbanTreeCanopy}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">{city.treeCover}%</span>
              <span className="text-xs text-[#94BDB2]">{t.dashboard.targetGoal}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#0F2420] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {t.dashboard.activeCitizenPins}
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-300">{pendingReports}</span>
              <span className="text-xs text-[#94BDB2]">{t.dashboard.inCity} {selectedCity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

