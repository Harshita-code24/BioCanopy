import {
  AlertCircle,
  BarChart3,
  Clock,
  Database,
  Globe2,
  HeartPulse,
  Info,
  Satellite,
  Sun,
  Trees,
  Wind,
} from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cityMetrics, translations } from '../data/mockData';
import { useAppState } from '../store/AppStateContext';
import type { Language } from '../types';

// Mock 24-Hour Hourly Telemetry Data
const hourlyData = [
  { hour: '6 AM', temp: 28, aqi: 110, heatRisk: 30 },
  { hour: '8 AM', temp: 31, aqi: 145, heatRisk: 42 },
  { hour: '10 AM', temp: 35, aqi: 170, heatRisk: 65 },
  { hour: '12 PM', temp: 39, aqi: 185, heatRisk: 88 },
  { hour: '2 PM', temp: 41.5, aqi: 195, heatRisk: 95 },
  { hour: '4 PM', temp: 40, aqi: 180, heatRisk: 90 },
  { hour: '6 PM', temp: 36, aqi: 155, heatRisk: 60 },
  { hour: '8 PM', temp: 32, aqi: 130, heatRisk: 40 },
  { hour: '10 PM', temp: 29, aqi: 115, heatRisk: 32 },
];

function GlowingGaugeCard({
  label,
  value,
  unit,
  max,
  band,
  statusLabel,
  description,
  provenance,
  provenanceIcon: ProvenanceIcon,
}: {
  label: string;
  value: number;
  unit: string;
  max: number;
  band: 'green' | 'amber' | 'red';
  statusLabel: string;
  description: string;
  provenance: string;
  provenanceIcon: any;
}) {
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = 251.2 * (1 - percentage);

  const colors = {
    green: {
      stroke: '#22C55E',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
      glow: 'shadow-[0_0_25px_rgba(34,197,94,0.2)]',
    },
    amber: {
      stroke: '#F59E0B',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    },
    red: {
      stroke: '#EF4444',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300 border-red-500/30',
      dot: 'bg-red-400',
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.2)]',
    },
  }[band];

  return (
    <div
      className={`flex flex-col justify-between rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 backdrop-blur-xl transition hover:border-emerald-400/40 ${colors.glow}`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
              {label}
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-white">{value}</span>
              <span className="text-sm font-bold text-[#94BDB2]">{unit}</span>
            </div>
          </div>

          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${colors.badge}`}
          >
            <span className={`h-2 w-2 rounded-full ${colors.dot}`}></span>
            {statusLabel}
          </span>
        </div>

        {/* Semi-Circular SVG Gauge */}
        <div className="relative my-4 flex justify-center">
          <svg className="h-32 w-48" viewBox="0 0 180 100">
            {/* Background Arch */}
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke="#081412"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Reference Ticks */}
            <path
              d="M 20 90 A 70 70 0 0 1 60 38"
              fill="none"
              stroke="rgba(74, 222, 128, 0.3)"
              strokeWidth="3"
            />
            <path
              d="M 65 34 A 70 70 0 0 1 115 34"
              fill="none"
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth="3"
            />
            <path
              d="M 120 38 A 70 70 0 0 1 160 90"
              fill="none"
              stroke="rgba(248, 113, 113, 0.3)"
              strokeWidth="3"
            />

            {/* Glowing Active Value Arch */}
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke={colors.stroke}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${colors.stroke})` }}
            />
          </svg>

          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94BDB2]/60">
              3-Band Simplified Scale
            </span>
          </div>
        </div>

        {/* Citizen Explanation */}
        <div className="rounded-2xl bg-[#081412] p-3 text-xs leading-relaxed text-[#ECFDF5] border border-emerald-500/10">
          <p className="font-semibold">{description}</p>
        </div>
      </div>

      {/* Provenance Footnote */}
      <div className="mt-4 flex items-center gap-2 border-t border-emerald-500/15 pt-3 text-[11px] text-[#94BDB2]">
        <ProvenanceIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        <span className="truncate">{provenance}</span>
      </div>
    </div>
  );
}

export function OpenDataPage() {
  const { selectedCity, language, setLanguage } = useAppState();
  const copy = translations[language];

  const city = useMemo(
    () => cityMetrics.find((c) => c.city === selectedCity) ?? cityMetrics[0],
    [selectedCity],
  );

  const heatBand: 'green' | 'amber' | 'red' =
    city.temperature >= 38 ? 'red' : city.temperature >= 33 ? 'amber' : 'green';

  const aqiBand: 'green' | 'amber' | 'red' =
    city.aqi > 150 ? 'red' : city.aqi > 90 ? 'amber' : 'green';

  const canopyBand: 'green' | 'amber' | 'red' =
    city.treeCover >= 30 ? 'green' : city.treeCover >= 20 ? 'amber' : 'red';

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <div className="space-y-6">
      {/* Sleek Clean Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white sm:text-2xl">
              {copy.navDashboard} · {city.city}
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#94BDB2]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CPCB Live Stream</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">{city.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Regional Language Switcher */}
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="flex flex-wrap gap-1 rounded-2xl bg-[#0F2420] p-1 border border-emerald-500/20">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  language === item.code
                    ? 'bg-emerald-600 text-white shadow-glow'
                    : 'text-[#94BDB2] hover:text-white'
                }`}
              >
                {item.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Glowing Gauges: Heat, AQI, Canopy */}
      <div className="grid gap-6 md:grid-cols-3">
        <GlowingGaugeCard
          label={copy.heatIndexLabel}
          value={city.temperature}
          unit="°C"
          max={50}
          band={heatBand}
          statusLabel={heatBand === 'red' ? 'Extreme Heat' : heatBand === 'amber' ? 'Moderate' : 'Optimal'}
          description={
            heatBand === 'red'
              ? 'Extreme surface heat detected. Asphalt roads radiating high radiant energy. Use shaded corridors.'
              : 'Thermal conditions are manageable. Stay hydrated with regular shade breaks.'
          }
          provenance={city.imdStation}
          provenanceIcon={Sun}
        />

        <GlowingGaugeCard
          label={copy.aqiLabel}
          value={city.aqi}
          unit="AQI"
          max={300}
          band={aqiBand}
          statusLabel={aqiBand === 'red' ? 'Poor Air' : aqiBand === 'amber' ? 'Moderate' : 'Good'}
          description={
            aqiBand === 'red'
              ? 'Unhealthy particulate concentration. Inversion trapping road dust. Prefer tree-lined routes.'
              : 'Satisfactory air quality. Clean airflow across urban green corridors.'
          }
          provenance={city.cpcbStation}
          provenanceIcon={Wind}
        />

        <GlowingGaugeCard
          label={copy.canopyLabel}
          value={city.treeCover}
          unit="%"
          max={50}
          band={canopyBand}
          statusLabel={canopyBand === 'red' ? 'Canopy Deficit' : 'Healthy Canopy'}
          description={`Urban canopy density is ${city.treeCover}%, leaving a -${city.targetCanopy - city.treeCover}% deficit below the national municipal greening target.`}
          provenance={copy.provenanceSatellite}
          provenanceIcon={Satellite}
        />
      </div>

      {/* 24-Hour Diurnal Heat & Smog Curve (Recharts) */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                24-Hour Diurnal Heat & Smog Forecast Curve
              </h3>
              <p className="text-xs text-[#94BDB2]">
                Hourly surface heat peak from 12 PM to 5 PM mapped against particulate AQI
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
            Ground Sensors + Satellites
          </span>
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(45,212,191,0.1)" strokeDasharray="4 4" />
              <XAxis dataKey="hour" stroke="#94BDB2" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94BDB2" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A1B17',
                  borderColor: 'rgba(45,212,191,0.3)',
                  borderRadius: '16px',
                  color: '#ECFDF5',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temperature (°C)"
                stroke="#EF4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
              <Area
                type="monotone"
                dataKey="aqi"
                name="AQI Index"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#aqiGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
