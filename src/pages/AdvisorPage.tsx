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
import { useTranslation } from '../i18n/useTranslation';
import { useAppState } from '../store/AppStateContext';
import type { AiConditionPreset } from '../types';

export function AdvisorPage() {
  const { selectedCity } = useAppState();
  const { t, language } = useTranslation();
  const copy = t.advisor;
  const [temperature, setTemperature] = useState(39);

  // Derive dynamic rule-based guidance from temperature
  const dynamicTip = useMemo(() => {
    if (temperature >= 42) {
      return {
        level: language === 'hi' ? 'तीव्र लू चेतावनी' : language === 'mr' ? 'अति तीव्र उष्णतेचा इशारा' : 'Extreme Heatwave Response',
        headline: copy.guidanceHeatwaveHeadline,
        body: copy.guidanceHeatwaveBody,
        color: 'border-red-500/50 bg-red-500/10 text-red-300',
        badge: copy.extremeWarning,
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
        hydration: language === 'hi' ? 'प्रति ३० मिनट में ५०० मिली जलपान करें' : language === 'mr' ? 'दर ३० मिनिटांनी ५०० मिली पाणी प्या' : 'Drink 500ml oral fluids every 30 mins',
        safeHours: language === 'hi' ? 'सुबह १०:३० से पहले या शाम ६:०० के बाद' : language === 'mr' ? 'सकाळी १०:३० पूर्वी किंवा संध्याकाळी ६:०० नंतर' : 'Before 10:30 AM or after 6:00 PM',
      };
    }
    if (temperature >= 37) {
      return {
        level: language === 'hi' ? 'दोपहर की उष्णता चेतावनी' : language === 'mr' ? 'दुपारचा उष्णता इशारा' : 'Midday Thermal Alert',
        headline: copy.guidanceSmogHeadline,
        body: copy.guidanceSmogBody,
        color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
        badge: copy.highAdvisory,
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        hydration: language === 'hi' ? 'प्रति ४५ मिनट में ४०० मिली जलपान करें' : language === 'mr' ? 'दर ४५ मिनिटांनी ४०० मिली पाणी प्या' : 'Drink 400ml water every 45 mins',
        safeHours: language === 'hi' ? 'सुबह ११:३० से पहले या शाम ५:०० के बाद' : language === 'mr' ? 'सकाळी ११:३० पूर्वी किंवा संध्याकाळी ५:०० नंतर' : 'Before 11:30 AM or after 5:00 PM',
      };
    }
    if (temperature >= 32) {
      return {
        level: language === 'hi' ? 'मध्यम तापमान सतर्कता' : language === 'mr' ? 'मध्यम उष्णता सूचना' : 'Moderate Warm Protocol',
        headline: copy.guidanceModerateHeadline,
        body: copy.guidanceModerateBody,
        color: 'border-teal-500/50 bg-teal-500/10 text-teal-300',
        badge: copy.moderateAdvisory,
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        hydration: language === 'hi' ? 'हर घंटे पानी पिएं' : language === 'mr' ? 'दर तासाला पाणी प्या' : 'Hydrate every hour',
        safeHours: language === 'hi' ? 'छायादार मार्गों के साथ सभी घंटे' : language === 'mr' ? 'सावलीच्या मार्गाने सर्व वेळ सुरक्षित' : 'All hours with shaded walking paths',
      };
    }
    return {
      level: language === 'hi' ? 'आरामदायक मौसम' : language === 'mr' ? 'सुखद हवामान' : 'Comfortable Window',
      headline: copy.guidanceComfortHeadline,
      body: copy.guidanceComfortBody,
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
      badge: copy.comfortableWindow,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      hydration: language === 'hi' ? 'सामान्य दैनिक जलपान (२.५ लीटर)' : language === 'mr' ? 'नेहमीप्रमाणे पाणी प्या (२.५ लीटर)' : 'Normal daily intake (2.5L)',
      safeHours: language === 'hi' ? 'सभी घंटे सुरक्षित' : language === 'mr' ? 'सर्व वेळ सुरक्षित' : 'All hours safe',
    };
  }, [temperature, language, copy]);

  const safeLabel = language === 'hi' ? 'सुरक्षित' : language === 'mr' ? 'सुरक्षित' : 'Safe';
  const cautionLabel = language === 'hi' ? 'सतर्क रहें' : language === 'mr' ? 'काळजी घ्या' : 'Caution';
  const avoidLabel = language === 'hi' ? 'टालें' : language === 'mr' ? 'टाळा' : 'Avoid';

  return (
    <div className="space-y-6">
      {/* Sleek Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl">
            {copy.title} · {selectedCity}
          </h1>
          <p className="text-xs text-[#94BDB2]">
            {copy.subtitle}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          {copy.liveEngine}
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
                    {language === 'hi' ? 'सक्रिय परामर्श इंजन' : language === 'mr' ? 'सक्रिय सल्लागार इंजिन' : 'Active Advisory Engine'}
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
                  <p className="font-bold text-white">
                    {language === 'hi' ? 'जलपान निर्देश' : language === 'mr' ? 'पाणी पिण्याचा सल्ला' : 'Hydration Directive'}
                  </p>
                  <p className="text-[#94BDB2] mt-0.5 text-[11px]">{dynamicTip.hydration}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-[#0A1B17] p-3.5 flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">
                    {language === 'hi' ? 'सुरक्षित आवागमन समय' : language === 'mr' ? 'सुरक्षित प्रवासाची वेळ' : 'Safe Transit Window'}
                  </p>
                  <p className="text-[#94BDB2] mt-0.5 text-[11px]">{dynamicTip.safeHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-emerald-500/20 pt-4 text-xs text-[#94BDB2]">
            <span>{language === 'hi' ? 'सत्यापित: CPCB व IMD स्टेशन' : language === 'mr' ? 'तपासलेले: CPCB आणि IMD केंद्र' : 'Validated: CPCB Mandir Marg + IMD Safdarjung'}</span>
            <span className="text-emerald-400 font-semibold">Rules Engine v2.4</span>
          </div>
        </div>

        {/* Right: Dynamic Interactive Temperature Slider & Simulator */}
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 sm:p-7 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                {language === 'hi' ? 'लाइव तापमान स्लाइडर' : language === 'mr' ? 'तापमान स्लाइडर' : 'Live Condition Slider'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#94BDB2]">
              {language === 'hi' ? 'नियम प्रतिक्रिया जांचने के लिए खींचें' : language === 'mr' ? 'तपासण्यासाठी स्लाइडर हलवा' : 'Drag to test rule response'}
            </span>
          </div>

          {/* Big Temperature Display */}
          <div className="flex items-center justify-between rounded-2xl bg-[#081412] p-5 border border-emerald-500/20">
            <div>
              <p className="text-[11px] font-bold uppercase text-[#94BDB2]">
                {copy.simulateTemp}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{temperature}</span>
                <span className="text-xl font-bold text-emerald-400">°C</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#94BDB2]">{language === 'hi' ? 'लक्षित शहर' : language === 'mr' ? 'निवडलेले शहर' : 'Target City'}</p>
              <p className="text-sm font-bold text-white">{selectedCity}</p>
              <p className="text-[11px] text-amber-400 mt-1">
                {language === 'hi' ? 'डामर सतह' : language === 'mr' ? 'डांबरी पृष्ठभाग' : 'Asphalt'}: ~{(temperature + 7.5).toFixed(0)}°C
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
              <span>26°C {language === 'hi' ? 'हल्का' : language === 'mr' ? 'सौम्य' : 'Mild'}</span>
              <span>35°C {language === 'hi' ? 'गर्म' : language === 'mr' ? 'उबदार' : 'Warm'}</span>
              <span>41°C {language === 'hi' ? 'लू' : language === 'mr' ? 'उष्णतेची लाट' : 'Heatwave'}</span>
              <span>46°C {language === 'hi' ? 'अत्यधिक' : language === 'mr' ? 'अति तीव्र' : 'Extreme'}</span>
            </div>
          </div>

          {/* 3 Quick Scenario Presets */}
          <div className="space-y-2 border-t border-emerald-500/20 pt-4">
            <p className="text-xs font-bold text-white">
              {language === 'hi' ? 'पूर्व-निर्धारित परिदृश्य:' : language === 'mr' ? 'नमुने:' : 'Preset Scenarios:'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemperature(41)}
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-center text-xs font-semibold text-red-300 hover:bg-red-500/20"
              >
                {copy.scenarioHeatwave}
              </button>
              <button
                type="button"
                onClick={() => setTemperature(34)}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2 text-center text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                {copy.scenarioSmog}
              </button>
              <button
                type="button"
                onClick={() => setTemperature(29)}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-center text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
              >
                {copy.scenarioSunset}
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
                {copy.hourlyForecastTitle}
              </h3>
              <p className="text-xs text-[#94BDB2]">
                {language === 'hi' ? 'पैदल, साइकिल या सार्वजनिक पारगमन के लिए प्रति घंटे सुरक्षा अनुशंसाएं' : language === 'mr' ? 'चालणे, सायकलिंग किंवा प्रवासासाठी प्रति तास सुरक्षा शिफारसी' : 'Hourly safety recommendations for walking, cycling, or outdoor transit'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-400">
            {language === 'hi' ? 'स्वचालित नियम मूल्यांकन' : language === 'mr' ? 'स्वयंचलित नियम मूल्यांकन' : 'Automated Rules Evaluation'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 text-center text-xs">
          {[
            { hour: '7 AM', status: safeLabel, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { hour: '9 AM', status: safeLabel, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { hour: '11 AM', status: cautionLabel, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { hour: '1 PM', status: avoidLabel, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
            { hour: '3 PM', status: avoidLabel, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
            { hour: '5 PM', status: cautionLabel, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
            { hour: '7 PM', status: safeLabel, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { hour: '9 PM', status: safeLabel, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
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
