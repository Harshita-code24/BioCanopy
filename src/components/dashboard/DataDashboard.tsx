import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Database,
  ExternalLink,
  Flame,
  Globe2,
  HeartPulse,
  Info,
  Layers,
  MapPin,
  Satellite,
  ShieldAlert,
  Sparkles,
  Sun,
  Trees,
  Wind,
} from 'lucide-react';
import { useMemo } from 'react';
import { cityMetrics, translations } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import type { Language } from '../../types';

// Simplified 3-Band Color Gauge SVG Component
function ThreeBandGauge({
  value,
  max,
  label,
  unit,
  interpretation,
  band,
  provenance,
  provenanceIcon: ProvenanceIcon,
}: {
  value: number;
  max: number;
  label: string;
  unit: string;
  interpretation: string;
  band: 'green' | 'amber' | 'red';
  provenance: string;
  provenanceIcon: any;
}) {
  // 180-degree semi-circle gauge
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = 251.2 * (1 - percentage);

  const bandColors = {
    green: {
      stroke: '#22C55E',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'SAFE / OPTIMAL',
      dot: 'bg-emerald-500',
    },
    amber: {
      stroke: '#F59E0B',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      badge: 'MODERATE / CAUTION',
      dot: 'bg-amber-500',
    },
    red: {
      stroke: '#EF4444',
      bg: 'bg-red-50 text-red-800 border-red-200',
      badge: 'HIGH RISK / ACTION',
      dot: 'bg-red-500',
    },
  }[band];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        {/* Metric Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {label}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-gray-900">{value}</span>
              <span className="text-sm font-semibold text-gray-500">{unit}</span>
            </div>
          </div>

          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${bandColors.bg}`}
          >
            <span className={`h-2 w-2 rounded-full ${bandColors.dot}`}></span>
            {bandColors.badge}
          </span>
        </div>

        {/* Circular Semi-Arc Gauge */}
        <div className="relative my-4 flex justify-center">
          <svg className="h-32 w-48" viewBox="0 0 180 100">
            {/* Background Arch */}
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Band Reference Ticks: Green (0-33%), Amber (33-66%), Red (66-100%) */}
            <path
              d="M 20 90 A 70 70 0 0 1 60 38"
              fill="none"
              stroke="#86EFAC"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 65 34 A 70 70 0 0 1 115 34"
              fill="none"
              stroke="#FCD34D"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 120 38 A 70 70 0 0 1 160 90"
              fill="none"
              stroke="#FCA5A5"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Active Value Progress Arch */}
            <path
              d="M 20 90 A 70 70 0 0 1 160 90"
              fill="none"
              stroke={bandColors.stroke}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-xs font-semibold text-gray-500">
              Simplified 3-Band Scale
            </span>
          </div>
        </div>

        {/* Plain-Language Citizen Interpretation */}
        <div className="rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
          <p className="font-semibold text-gray-900">{interpretation}</p>
        </div>
      </div>

      {/* Provenance Footnote (CPCB / IMD / Satellite) */}
      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-[11px] text-gray-500">
        <ProvenanceIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <span className="truncate">{provenance}</span>
      </div>
    </div>
  );
}

export function DataDashboard() {
  const { selectedCity, language, setLanguage, currentMetric } = useAppState();
  const copy = translations[language];

  const city = currentMetric;

  // Band calculations for 3-band scale
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
      {/* Header & Multi-Language Toggle */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold uppercase text-emerald-800">
              Open Data Architecture
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs font-medium text-gray-500">
              {city.lastUpdated}
            </span>
          </div>
          <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
            {copy.navDashboard} — {city.city}, {city.state}
          </h2>
          <p className="text-xs text-gray-600 sm:text-sm">
            Translating complex ground sensor feeds and satellite thermal telemetry into simple, actionable public signals.
          </p>
        </div>

        {/* Multi-Language Switcher Toggle */}
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-gray-400" />
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  language === item.code
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Simplified 3-Color Metric Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Metric 1: Local Heat Index */}
        <ThreeBandGauge
          label={copy.heatIndexLabel}
          value={city.temperature}
          unit="°C"
          max={50}
          band={heatBand}
          interpretation={
            heatBand === 'red'
              ? 'Extreme surface heat. Pavement radiating peak thermal energy. Stay indoors or use shaded routes.'
              : heatBand === 'amber'
              ? 'Warm afternoon conditions. Shaded tree pathways provide 3-4°C cooling relief.'
              : 'Thermal conditions within comfortable pedestrian limits.'
          }
          provenance={city.imdStation}
          provenanceIcon={Sun}
        />

        {/* Metric 2: Air Quality (AQI) */}
        <ThreeBandGauge
          label={copy.aqiLabel}
          value={city.aqi}
          unit="AQI"
          max={300}
          band={aqiBand}
          interpretation={
            aqiBand === 'red'
              ? 'Unhealthy particulate concentration. Inversion trapping road dust. Wear filtration masks.'
              : aqiBand === 'amber'
              ? 'Moderate smog. Sensitive individuals should avoid prolonged outdoor cardiovascular activity.'
              : 'Satisfactory air quality. Clean airflow across canopy corridors.'
          }
          provenance={city.cpcbStation}
          provenanceIcon={Wind}
        />

        {/* Metric 3: Urban Canopy Density */}
        <ThreeBandGauge
          label={copy.canopyLabel}
          value={city.treeCover}
          unit="%"
          max={50}
          band={canopyBand}
          interpretation={
            canopyBand === 'red'
              ? `Deficit of -${city.targetCanopy - city.treeCover}% below urban target. High vulnerability to heat trapping.`
              : canopyBand === 'amber'
              ? 'Moderate canopy cover. Needs corridor tree-planting infill to shade pedestrian walks.'
              : 'Healthy canopy corridor. High evapotranspirative cooling capacity.'
          }
          provenance={copy.provenanceSatellite}
          provenanceIcon={Satellite}
        />
      </div>

      {/* Deep-Dive Citizen Guidance & Environmental Context Panel */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left: Citizen Plain-Language Action Cards */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">
                Actionable Public Health Guidance
              </h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
              Citizen First
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <Trees className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Prefer Shaded Corridors for Transit
                </h4>
                <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                  Walking under tree canopy lowers mean radiant temperature by up to 11°C compared to exposed asphalt. Use the Cool-Route map before stepping out.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <Sun className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Avoid Midday Unshaded Transit (12 PM – 4 PM)
                </h4>
                <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                  Flyovers and concrete pavements absorb shortwave solar radiation and radiate heat upwards. Re-schedule heavy errands to early morning or after sunset.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-800">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  Report Local Unshaded Corridors & Dust Spikes
                </h4>
                <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                  Ground reports directly escalate to the municipal tree-planting queue. Your geotagged pins prioritize city greening budgets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: SDG & Scientific Provenance Architecture */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Database className="h-5 w-5 text-[#14532D]" />
            <h3 className="text-sm font-bold text-gray-900">
              UN SDG Mapping & Evidence
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
              <span className="text-[11px] font-bold text-emerald-900">
                {copy.sdg13Title}
              </span>
              <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                Adaptive capacity (13.1) through shade-first pedestrian navigation and spatial heat priority queues for municipal tree planting (13.2).
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3">
              <span className="text-[11px] font-bold text-blue-900">
                {copy.sdg11Title}
              </span>
              <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                Target 11.6: Lowering particulate inhalation and reducing urban environmental impact through community hazard reporting.
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50/70 p-3">
              <span className="text-[11px] font-bold text-green-900">
                {copy.sdg3Title}
              </span>
              <p className="mt-1 text-xs text-green-800 leading-relaxed">
                Target 3.9: Substantially reducing pedestrian heat stroke deaths and illnesses from airborne particulate exposure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
