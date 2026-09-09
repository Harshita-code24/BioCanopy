import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  Droplets,
  HeartPulse,
  Home,
  Navigation,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  Trees,
  Wind,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { aiAdvisorScenarios, cityMetrics } from '../data/mockData';
import { useAppState } from '../store/AppStateContext';
import type { AiConditionPreset } from '../types';

export function AdvisorPage() {
  const { selectedCity, selectedPreset, setSelectedPreset } = useAppState();
  const [temperature, setTemperature] = useState(39);

  const city = cityMetrics.find((c) => c.city === selectedCity) ?? cityMetrics[0];

  // Derive dynamic rule-based guidance from temperature
  const dynamicTip = useMemo(() => {
    if (temperature >= 42) {
      return {
        level: 'Extreme Heatwave Response',
        headline: 'Stay indoors until 5:30 PM — Extreme asphalt radiation detected',
        body: 'Unshaded concrete surface temperatures exceed 50°C. Postpone non-essential travel. If transit is unavoidable, utilize the 82% shaded green cool path.',
        color: 'border-red-500/50 bg-red-500/10 text-red-300',
        badge: 'CRITICAL WARNING',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
        hydration: 'Drink 500ml oral fluids every 30 mins',
        safeHours: 'Before 10:30 AM or after 6:00 PM',
      };
    }
    if (temperature >= 37) {
      return {
        level: 'Midday Thermal Alert',
        headline: 'Limit unshaded transit — Peak solar radiant heat active',
        body: 'Keep windows and blinds closed between 12 PM and 4 PM to prevent indoor heat trapping. Walk strictly under shaded neem & banyan tree arches.',
        color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
        badge: 'HIGH ADVISORY',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        hydration: 'Drink 400ml water every 45 mins',
        safeHours: 'Before 11:30 AM or after 5:00 PM',
      };
    }
    if (temperature >= 32) {
      return {
        level: 'Moderate Warm Protocol',
        headline: 'Manageable conditions with hydration and shaded corridors',
        body: 'Ambient conditions are warm but within pedestrian safety thresholds. Utilize shaded tree corridors to enjoy 3-4°C microclimate relief.',
        color: 'border-teal-500/50 bg-teal-500/10 text-teal-300',
        badge: 'MODERATE',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        hydration: 'Hydrate every hour',
        safeHours: 'All hours with shaded walking paths',
      };
    }
    return {
      level: 'Comfortable Window',
      headline: 'Optimal outdoor conditions — Safe for transit & recreation',
      body: 'Temperatures are within comfortable levels. Open windows for cross-ventilation and take advantage of outdoor green parks.',
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      badge: 'SAFE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      hydration: 'Normal daily intake (2.5L)',
      safeHours: 'All hours safe',
    };
  }, [temperature]);

  return (
    <div className="space-y-6">
      {/* Sleek Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl">
            AI Heat & Health Safety Advisor · {selectedCity}
          </h1>
          <p className="text-xs text-[#94BDB2]">
            Dynamic plain-language advisory derived from ground telemetry
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          Live Engine
        </span>
      </div>

      {/* Main Interactive Advisor Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Dynamic Rule-Based AI Tip Card */}
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 sm:p-7 shadow-card flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Active Advisory Engine
                  </p>
                  <h3 className="text-lg font-bold text-white">
                    {dynamicTip.level}
                  </h3>
                </div>
              </div>

              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${dynamicTip.badgeColor}`}>
                {dynamicTip.badge}
              </span>
            </div>

            {/* Generated Actionable Tip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={dynamicTip.headline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-emerald-500/30 bg-[#081412] p-5 space-y-3"
              >
                <h4 className="text-base font-bold text-white sm:text-lg leading-snug">
                  "{dynamicTip.headline}"
                </h4>
                <p className="text-xs sm:text-sm text-[#94BDB2] leading-relaxed">
                  {dynamicTip.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Practical Checklist */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-emerald-500/20 bg-[#0A1B17] p-3.5 flex items-start gap-2.5">
                <Droplets className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Hydration Directive</p>
                  <p className="text-[#94BDB2] mt-0.5 text-[11px]">{dynamicTip.hydration}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-[#0A1B17] p-3.5 flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Safe Transit Window</p>
                  <p className="text-[#94BDB2] mt-0.5 text-[11px]">{dynamicTip.safeHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-emerald-500/20 pt-4 text-xs text-[#94BDB2]">
            <span>Validated: CPCB Mandir Marg + IMD Safdarjung</span>
            <span className="text-emerald-400 font-semibold">Rules Engine v2.4</span>
          </div>
        </div>

        {/* Right: Dynamic Interactive Temperature Slider & Simulator */}
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 sm:p-7 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Live Condition Slider
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#94BDB2]">
              Drag to test rule response
            </span>
          </div>

          {/* Big Temperature Display */}
          <div className="flex items-center justify-between rounded-2xl bg-[#081412] p-5 border border-emerald-500/20">
            <div>
              <p className="text-[11px] font-bold uppercase text-[#94BDB2]">
                Simulated Outdoor Temp
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{temperature}</span>
                <span className="text-xl font-bold text-emerald-400">°C</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#94BDB2]">Target City</p>
              <p className="text-sm font-bold text-white">{selectedCity}</p>
              <p className="text-[11px] text-amber-400 mt-1">
                Asphalt: ~{(temperature + 7.5).toFixed(0)}°C
              </p>
            </div>
          </div>

          {/* Interactive Range Input Slider */}
          <div>
            <input
              type="range"
              min={26}
              max={46}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2.5 bg-[#081412] rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-emerald-500/30"
            />
            <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]">
              <span>26°C Mild</span>
              <span>35°C Warm</span>
              <span>41°C Heatwave</span>
              <span>46°C Extreme</span>
            </div>
          </div>

          {/* 3 Quick Scenario Presets */}
          <div className="space-y-2 border-t border-emerald-500/20 pt-4">
            <p className="text-xs font-bold text-white">Preset Scenarios:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemperature(41)}
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-center text-xs font-semibold text-red-300 hover:bg-red-500/20"
              >
                Heat Peak (41°C)
              </button>
              <button
                type="button"
                onClick={() => setTemperature(34)}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-center text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                Afternoon (34°C)
              </button>
              <button
                type="button"
                onClick={() => setTemperature(29)}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-center text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
              >
                Sunset (29°C)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Hourly Commute Safety Window Table */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Personalized Commute Safety Window
              </h3>
              <p className="text-xs text-[#94BDB2]">
                Hourly safety recommendations for walking, cycling, or outdoor transit
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-400">
            Automated Rules Evaluation
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 text-center text-xs">
          {[
            { hour: '7 AM', status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { hour: '9 AM', status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { hour: '11 AM', status: 'Caution', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { hour: '1 PM', status: 'Avoid', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
            { hour: '3 PM', status: 'Avoid', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
            { hour: '5 PM', status: 'Caution', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { hour: '7 PM', status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { hour: '9 PM', status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
          ].map((slot) => (
            <div
              key={slot.hour}
              className={`rounded-2xl border p-3 flex flex-col items-center justify-center ${slot.color}`}
            >
              <span className="font-bold text-white">{slot.hour}</span>
              <span className="mt-1 text-[11px] font-semibold">{slot.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
