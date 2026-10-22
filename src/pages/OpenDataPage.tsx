import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Database,
  Download,
  Info,
  Layers,
  MapPin,
  RefreshCw,
  Satellite,
  ShieldAlert,
  Sun,
  Thermometer,
  Trees,
  Wind,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cityMetrics } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';
import { useAppState } from '../store/AppStateContext';
import type { Language } from '../types';

// Fallback 24-Hour Hourly Telemetry Data if backend is momentarily unreachable
const defaultHourlyData = [
  { time: '00:00', hour: '12 AM', displayHour: '12 AM', temp: 24.5, temperature: 24.5, surfaceTemp: 26.0, humidity: 75, aqi: 110, pm25: 42, pm10: 85, heatRisk: 'Low' },
  { time: '03:00', hour: '3 AM', displayHour: '3 AM', temp: 23.0, temperature: 23.0, surfaceTemp: 24.2, humidity: 80, aqi: 105, pm25: 38, pm10: 78, heatRisk: 'Low' },
  { time: '06:00', hour: '6 AM', displayHour: '6 AM', temp: 25.0, temperature: 25.0, surfaceTemp: 27.5, humidity: 78, aqi: 125, pm25: 50, pm10: 95, heatRisk: 'Low' },
  { time: '09:00', hour: '9 AM', displayHour: '9 AM', temp: 31.5, temperature: 31.5, surfaceTemp: 35.8, humidity: 62, aqi: 155, pm25: 68, pm10: 120, heatRisk: 'Moderate' },
  { time: '12:00', hour: '12 PM', displayHour: '12 PM', temp: 37.0, temperature: 37.0, surfaceTemp: 42.2, humidity: 48, aqi: 175, pm25: 82, pm10: 145, heatRisk: 'Moderate' },
  { time: '15:00', hour: '3 PM', displayHour: '3 PM', temp: 39.5, temperature: 39.5, surfaceTemp: 45.0, humidity: 42, aqi: 190, pm25: 95, pm10: 165, heatRisk: 'High' },
  { time: '18:00', hour: '6 PM', displayHour: '6 PM', temp: 35.0, temperature: 35.0, surfaceTemp: 38.5, humidity: 55, aqi: 160, pm25: 75, pm10: 130, heatRisk: 'Moderate' },
  { time: '21:00', hour: '9 PM', displayHour: '9 PM', temp: 29.0, temperature: 29.0, surfaceTemp: 31.2, humidity: 68, aqi: 135, pm25: 58, pm10: 105, heatRisk: 'Low' },
];

type TrendPoint = {
  time: string;
  hour: string;
  displayHour?: string;
  temperature: number;
  temp?: number;
  surfaceTemp?: number;
  humidity: number;
  aqi: number;
  pm25: number;
  pm10?: number;
  heatRisk?: string;
};

type CityOverview = {
  city: string;
  state: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  treeCover: number;
  targetCanopy: number;
  heatRisk: string;
  cpcbStation: string;
  imdStation: string;
  satelliteSurfaceTemp: number;
  lastUpdated: string;
};

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
  scaleLabel,
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
  scaleLabel?: string;
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
              {scaleLabel || '3-Band Simplified Scale'}
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
  const { selectedCity, setSelectedCity, currentMetric, isLoadingTelemetry, showToast, setIsProfileOpen } =
    useAppState();
  const { t, language } = useTranslation();
  const copy = t.openData;

  // Use live metric from backend telemetry state, with fallback
  const city = currentMetric || cityMetrics[0];

  // 24-Hour trends state
  const [trends, setTrends] = useState<TrendPoint[]>(defaultHourlyData);
  const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(true);
  const [activeChartView, setActiveChartView] = useState<'temp_aqi' | 'pm' | 'thermal_humidity'>('temp_aqi');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // All cities benchmark overview
  const [allCities, setAllCities] = useState<CityOverview[]>([]);
  const [isLoadingAllCities, setIsLoadingAllCities] = useState<boolean>(false);

  // Fetch live 24-hour trends from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchTrends = async () => {
      setIsLoadingTrends(true);
      try {
        const res = await fetch(`http://localhost:5000/api/telemetry/${selectedCity}/trends`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setTrends(data);
          }
        }
      } catch (err) {
        console.warn('Backend trends unreachable, displaying baseline data:', err);
      } finally {
        if (isMounted) setIsLoadingTrends(false);
      }
    };

    fetchTrends();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Fetch all cities telemetry overview for multi-city benchmark
  useEffect(() => {
    let isMounted = true;
    const fetchAllCities = async () => {
      setIsLoadingAllCities(true);
      try {
        const res = await fetch('http://localhost:5000/api/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setAllCities(data);
          }
        }
      } catch (err) {
        console.warn('Backend all cities telemetry unreachable:', err);
      } finally {
        if (isMounted) setIsLoadingAllCities(false);
      }
    };

    fetchAllCities();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Manual Force-Refresh Handler
  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/telemetry/${selectedCity}/refresh`, {
        method: 'POST',
      });
      if (res.ok) {
        const trendsRes = await fetch(`http://localhost:5000/api/telemetry/${selectedCity}/trends`);
        if (trendsRes.ok) {
          const freshTrends = await trendsRes.json();
          setTrends(freshTrends);
        }
        showToast(`✓ ${copy.refreshedLive} (${selectedCity})`, 'success');
      } else {
        showToast('Refresh request received. Using current telemetry.', 'info');
      }
    } catch {
      showToast('Backend offline. Keeping current sensor telemetry.', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Download CSV Telemetry Dataset Handler
  const handleDownloadCsv = () => {
    const downloadUrl = `http://localhost:5000/api/telemetry/${selectedCity}/export`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `biocanopy_${selectedCity.toLowerCase()}_telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📊 ${copy.downloadSuccess}`, 'success');
  };

  const heatBand: 'green' | 'amber' | 'red' =
    city.temperature >= 38 ? 'red' : city.temperature >= 33 ? 'amber' : 'green';

  const aqiBand: 'green' | 'amber' | 'red' =
    city.aqi > 150 ? 'red' : city.aqi > 90 ? 'amber' : 'green';

  const canopyBand: 'green' | 'amber' | 'red' =
    city.treeCover >= 30 ? 'green' : city.treeCover >= 20 ? 'amber' : 'red';

  return (
    <div className="space-y-6">
      {/* Sleek Clean Header & Controls Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-[#0A1B17] p-5 sm:p-7 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 shadow-glow shrink-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-white sm:text-2xl">
                  {copy.title} · <span className="text-emerald-400">{city.city}</span>
                </h1>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                  {city.state || 'India'}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-[#94BDB2]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>{copy.refreshedLive}</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">{city.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar: Refresh & CSV Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Refresh Button */}
            <button
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-3.5 py-2 text-xs font-bold text-[#ECFDF5] transition hover:bg-emerald-600/30 active:scale-95 disabled:opacity-60"
              title={copy.refreshData}
            >
              <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{copy.refreshData}</span>
            </button>

            {/* Download CSV Dataset Button */}
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-glow transition hover:bg-emerald-500 active:scale-95"
              title="Download CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{copy.exportCsv}</span>
            </button>
          </div>
        </div>

        {/* Real-time Environmental Pulse Strip (Mini KPIs) */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 border-t border-emerald-500/20 pt-4">
          <div className="rounded-xl border border-emerald-500/15 bg-[#081412]/80 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {language === 'hi' ? 'महसूस तापमान' : language === 'mr' ? 'जावणारे तापमान' : 'Feels Like'}
            </span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-lg font-black text-white">{city.feelsLike || city.temperature}°C</span>
              <span className="text-[10px] text-amber-400 font-bold">
                ({city.heatRisk || 'Moderate'})
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/15 bg-[#081412]/80 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {language === 'hi' ? 'सापेक्ष आर्द्रता' : language === 'mr' ? 'हवेतील आर्द्रता' : 'Relative Humidity'}
            </span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-lg font-black text-cyan-400">{city.humidity || 52}%</span>
              <span className="text-[10px] text-[#94BDB2]">RH</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/15 bg-[#081412]/80 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {language === 'hi' ? 'धूलिकण PM2.5' : language === 'mr' ? 'धूलिकण PM2.5' : 'Fine PM2.5'}
            </span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-lg font-black text-purple-400">{city.pm25 || 48}</span>
              <span className="text-[10px] text-[#94BDB2]">µg/m³</span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/15 bg-[#081412]/80 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              {language === 'hi' ? 'डामर सतह विकिरण' : language === 'mr' ? 'डांबरी पृष्ठभाग उष्णता' : 'Surface Radiant'}
            </span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-lg font-black text-rose-400">{city.satelliteSurfaceTemp || (city.temperature + 4.2).toFixed(1)}°C</span>
              <span className="text-[10px] text-rose-400 font-bold">+4.2°C Gain</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Glowing Gauges: Heat, AQI, Canopy */}
      <div className="grid gap-6 md:grid-cols-3">
        <GlowingGaugeCard
          label={copy.heatIndex}
          value={city.temperature}
          unit="°C"
          max={50}
          band={heatBand}
          statusLabel={
            heatBand === 'red'
              ? copy.dangerous
              : heatBand === 'amber'
                ? copy.moderate
                : (language === 'hi' ? 'अनुकूल' : language === 'mr' ? 'अनुकूल' : 'Optimal')
          }
          description={
            heatBand === 'red'
              ? (language === 'hi'
                  ? 'अत्यधिक सतह गर्मी दर्ज की गई। डामर की सड़कें उच्च विकिरण छोड़ रही हैं। छायादार रास्तों का उपयोग करें।'
                  : language === 'mr'
                    ? 'अति तीव्र उष्णता नोंदवली गेली. डांबरी रस्ते उष्णता उत्सर्जित करत आहेत. सावलीच्या मार्गांचा वापर करा.'
                    : 'Extreme surface heat detected. Asphalt roads radiating high radiant energy. Use shaded corridors.')
              : (language === 'hi'
                  ? 'गर्मी की स्थिति सामान्य है। पर्याप्त पानी पिएं और छाया में विश्राम करें।'
                  : language === 'mr'
                    ? 'उष्णतेची स्थिती मध्यम आहे. पुरेसे पाणी प्या आणि सावलीत विश्रांती घ्या.'
                    : 'Thermal conditions are manageable. Stay hydrated with regular shade breaks.')
          }
          provenance={city.imdStation || copy.provenanceImd}
          provenanceIcon={Sun}
          scaleLabel={language === 'hi' ? '3-स्तरीय सरलीकृत पैमाना' : language === 'mr' ? '३-स्तरीय सोपी श्रेणी' : '3-Band Simplified Scale'}
        />

        <GlowingGaugeCard
          label={copy.aqi}
          value={city.aqi}
          unit="AQI"
          max={300}
          band={aqiBand}
          statusLabel={
            aqiBand === 'red'
              ? copy.severe
              : aqiBand === 'amber'
                ? copy.moderate
                : (language === 'hi' ? 'अच्छा' : language === 'mr' ? 'चांगली' : 'Good')
          }
          description={
            aqiBand === 'red'
              ? (language === 'hi'
                  ? 'अस्वस्थ कण सांद्रता। धूल और प्रदूषण फंसा हुआ है। वृक्षारोपित मार्गों को प्राथमिकता दें।'
                  : language === 'mr'
                    ? 'प्रदूषणाची पातळी अस्वास्थ्यकर आहे. रस्त्यावरील धूळ साचली आहे. झाडे असलेल्या मार्गांना प्राधान्य द्या.'
                    : 'Unhealthy particulate concentration. Inversion trapping road dust. Prefer tree-lined routes.')
              : (language === 'hi'
                  ? 'हवा की गुणवत्ता संतोषजनक है। हरित गलियारों में स्वच्छ वायु प्रवाह।'
                  : language === 'mr'
                    ? 'हवेची गुणवत्ता समाधानकारक आहे. हरित पट्ट्यांमध्ये शुद्ध हवा.'
                    : 'Satisfactory air quality. Clean airflow across urban green corridors.')
          }
          provenance={city.cpcbStation || copy.provenanceCpcb}
          provenanceIcon={Wind}
          scaleLabel={language === 'hi' ? '3-स्तरीय सरलीकृत पैमाना' : language === 'mr' ? '३-स्तरीय सोपी श्रेणी' : '3-Band Simplified Scale'}
        />

        <GlowingGaugeCard
          label={copy.canopyDensity}
          value={city.treeCover}
          unit="%"
          max={50}
          band={canopyBand}
          statusLabel={
            canopyBand === 'red'
              ? copy.criticalShortfall
              : (language === 'hi' ? 'स्वस्थ हरित आवरण' : language === 'mr' ? 'निरोगी हरित आच्छादन' : 'Healthy Canopy')
          }
          description={
            language === 'hi'
              ? `शहरी वृक्ष आवरण घनता ${city.treeCover}% है, जो राष्ट्रीय नगरपालिका हरित लक्ष्य (33%) से ${city.targetCanopy - city.treeCover}% कम है।`
              : language === 'mr'
                ? `शहरी झाडांचे प्रमाण ${city.treeCover}% आहे, जे राष्ट्रीय महापालिका उद्दिष्टापेक्षा (33%) ${city.targetCanopy - city.treeCover}% कमी आहे.`
                : `Urban canopy density is ${city.treeCover}%, leaving a -${city.targetCanopy - city.treeCover}% deficit below the national municipal greening target.`
          }
          provenance={copy.provenanceSatellite}
          provenanceIcon={Satellite}
          scaleLabel={language === 'hi' ? '3-स्तरीय सरलीकृत पैमाना' : language === 'mr' ? '३-स्तरीय सोपी श्रेणी' : '3-Band Simplified Scale'}
        />
      </div>

      {/* 24-Hour Diurnal Heat & Smog Curve with Dynamic Backend Feed & View Switcher */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {copy.diurnalTitle} · <span className="text-emerald-400">{city.city}</span>
                </h3>
                {isLoadingTrends && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 ring-1 ring-cyan-500/30">
                    <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                    <span>Syncing API...</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94BDB2]">
                {copy.diurnalDesc}
              </p>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-[#081412] p-1 border border-emerald-500/20">
            <button
              onClick={() => setActiveChartView('temp_aqi')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeChartView === 'temp_aqi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              🌡️ {copy.viewTempAqi}
            </button>
            <button
              onClick={() => setActiveChartView('pm')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeChartView === 'pm'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              💨 {copy.viewPm}
            </button>
            <button
              onClick={() => setActiveChartView('thermal_humidity')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeChartView === 'thermal_humidity'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              ☀️ {copy.viewThermalHumidity}
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pm10Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="surfaceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(45,212,191,0.1)" strokeDasharray="4 4" />
              <XAxis
                dataKey="displayHour"
                stroke="#94BDB2"
                tick={{ fontSize: 11 }}
                interval={2}
              />
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
              <Legend
                wrapperStyle={{
                  paddingTop: '16px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              />

              {activeChartView === 'temp_aqi' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    name={copy.tempAxis}
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    name={copy.aqiAxis}
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#aqiGradient)"
                  />
                </>
              )}

              {activeChartView === 'pm' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="pm25"
                    name="PM2.5 (µg/m³)"
                    stroke="#A855F7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#pm25Gradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pm10"
                    name="PM10 Inhalable Dust (µg/m³)"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#pm10Gradient)"
                  />
                </>
              )}

              {activeChartView === 'thermal_humidity' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="surfaceTemp"
                    name="Surface Radiant Temp (°C)"
                    stroke="#F97316"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#surfaceGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    name="Relative Humidity (%)"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#humidityGradient)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inter-City Climate Comparison Grid (Live Backend) */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                {copy.multiCityCompare}
              </h3>
              <p className="text-xs text-[#94BDB2]">
                {copy.multiCityCompareDesc}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
            {copy.interCityComparison}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(allCities.length > 0 ? allCities : cityMetrics).map((c) => {
            const isCurrent = c.city === selectedCity;
            const isHighHeat = c.temperature >= 38;
            return (
              <div
                key={c.city}
                onClick={() => {
                  if (!isCurrent) {
                    showToast(`To view ${c.city}'s full telemetry & maps, update your location in your Profile.`, 'info');
                    setIsProfileOpen(true);
                  }
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  isCurrent
                    ? 'border-emerald-400/80 bg-emerald-950/40 shadow-glow'
                    : 'border-emerald-500/20 bg-[#081412] hover:border-emerald-500/40 hover:bg-[#0c1f19]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{c.city}</span>
                  {isCurrent ? (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/40">
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#94BDB2] hover:text-emerald-400 font-semibold">
                      Profile ↗
                    </span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1 text-center">
                  <div className="rounded-xl bg-[#0F2420] p-1.5">
                    <span className="block text-[9px] font-bold text-[#94BDB2] uppercase">Temp</span>
                    <span className={`text-xs font-extrabold ${isHighHeat ? 'text-rose-400' : 'text-white'}`}>
                      {c.temperature}°C
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0F2420] p-1.5">
                    <span className="block text-[9px] font-bold text-[#94BDB2] uppercase">AQI</span>
                    <span className={`text-xs font-extrabold ${c.aqi > 150 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {c.aqi}
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#0F2420] p-1.5">
                    <span className="block text-[9px] font-bold text-[#94BDB2] uppercase">Canopy</span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {c.treeCover}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-[#94BDB2]">
                  <span>{c.state || 'India'}</span>
                  <span className="font-semibold text-emerald-300 truncate max-w-[120px]">
                    {c.cpcbStation?.split('—')[1]?.trim() || 'Central CPCB'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sensor Station Provenance & Methodology Footnote */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0A1B17] p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {copy.stationDetails}
          </h4>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 text-xs text-[#94BDB2]">
          <div className="rounded-2xl border border-emerald-500/15 bg-[#081412] p-3">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <Wind className="h-3.5 w-3.5 text-cyan-400" />
              <span>Ground CPCB Telemetry</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {city.cpcbStation || copy.provenanceCpcb}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-[#081412] p-3">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span>Meteorological Observatory</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {city.imdStation || copy.provenanceImd}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/15 bg-[#081412] p-3">
            <div className="flex items-center gap-2 font-bold text-white mb-1">
              <Satellite className="h-3.5 w-3.5 text-emerald-400" />
              <span>Satellite Infrared Radiance</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {copy.provenanceSatellite}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}