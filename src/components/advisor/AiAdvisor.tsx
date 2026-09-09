import {
  AlertTriangle,
  Clock,
  Droplets,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react';
import { useState } from 'react';
import { aiAdvisorScenarios, cityMetrics } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import type { AiConditionPreset } from '../../types';

export function AiAdvisor() {
  const { selectedPreset, setSelectedPreset, selectedCity } = useAppState();
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const scenario = aiAdvisorScenarios[selectedPreset];
  const city = cityMetrics.find((c) => c.city === selectedCity) ?? cityMetrics[0];

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="w-full">
      {/* Contextual Top Alert Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-emerald-300 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  AI Contextual Advisory
                </span>

                {/* Dynamic Verified Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
                  </span>
                  <span>Refreshed 2 mins ago</span>
                </div>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${scenario.badgeColor}`}
                >
                  {scenario.badge}
                </span>

                <span className="hidden text-xs text-gray-500 sm:inline">
                  for {city.city} ({city.temperature}°C · AQI {city.aqi})
                </span>
              </div>

              {/* Single Plain-Language Actionable Recommendation */}
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                {scenario.headline}
              </h2>

              <p className="text-xs text-gray-600 sm:text-sm">
                {scenario.description}
              </p>
            </div>
          </div>

          {/* Quick Actions & Simulation Controller */}
          <div className="flex shrink-0 items-center gap-2 pt-1 md:pt-0">
            <div className="hidden rounded-xl bg-white/80 p-2 text-right text-xs shadow-xs ring-1 ring-gray-200/60 lg:block">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-semibold">{scenario.targetHours}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium mt-0.5">
                <Droplets className="h-3.5 w-3.5 text-emerald-600" />
                <span>{scenario.hydrationGoal}</span>
              </div>
            </div>

            <button
              onClick={() => setIsSimulationOpen(!isSimulationOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50"
              title="Switch environmental conditions to test AI rule engine"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-emerald-700 transition ${
                  isSimulationOpen ? 'rotate-180' : ''
                }`}
              />
              <span className="hidden sm:inline">Simulate Condition</span>
              <span className="sm:hidden">Test AI</span>
            </button>
          </div>
        </div>

        {/* Condition Simulation Drawer (Presentation Feature) */}
        {isSimulationOpen && (
          <div className="mt-4 border-t border-emerald-200/80 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-700">
                Test AI Advisory Rules Engine with live scenarios:
              </p>
              <span className="text-[11px] text-gray-500">
                Matches live heat + AQI sensor thresholds
              </span>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(
                [
                  {
                    id: 'peak_heat' as AiConditionPreset,
                    icon: Sun,
                    title: 'Peak Afternoon Heat',
                    sub: '41°C / Asphalt 48°C',
                  },
                  {
                    id: 'smog_morning' as AiConditionPreset,
                    icon: Wind,
                    title: 'Morning Particulate Smog',
                    sub: 'AQI 195 / PM10 Spike',
                  },
                  {
                    id: 'evening_cooling' as AiConditionPreset,
                    icon: Droplets,
                    title: 'Evening Sunset Cool-off',
                    sub: '31°C / Cross Breeze',
                  },
                ] as const
              ).map(({ id, icon: Icon, title, sub }) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedPreset(id);
                    handleRefresh();
                  }}
                  className={`flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                    selectedPreset === id
                      ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-1 ring-emerald-500'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      selectedPreset === id
                        ? 'text-emerald-700'
                        : 'text-gray-400'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold leading-none">{title}</p>
                    <p className="mt-1 text-[11px] text-gray-500">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
