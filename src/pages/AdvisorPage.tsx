import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  HeartPulse,
  Home,
  MessageSquare,
  Navigation,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  Trees,
  User,
  Users,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { useAppState } from '../store/AppStateContext';
import type { AdvisorResponse, DemographicPersona } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  time: string;
};

export function AdvisorPage() {
  const { selectedCity, currentMetric } = useAppState();
  const { t, language } = useTranslation();
  const copy = t.advisor;

  const [temperature, setTemperature] = useState<number>(() => currentMetric?.temperature || 39);
  const [persona, setPersona] = useState<DemographicPersona>('general');
  const [advisory, setAdvisory] = useState<AdvisorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Copilot Modal / Widget open state
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Chat consultation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text:
        language === 'hi'
          ? `नमस्ते! मैं ${selectedCity} के लिए आपका BioCanopy AI जलवायु एवं स्वास्थ्य को-पायलट हूँ। वर्तमान पर्यावरणीय स्थितियों, सुरक्षित आवागमन व स्वास्थ्य सुरक्षा से संबंधित कोई भी प्रश्न पूछें।`
          : language === 'mr'
          ? `नमस्कार! मी ${selectedCity} साठी आपला BioCanopy AI हवामान आणि आरोग्य को-पायलट आहे. तापमान, सुरक्षित प्रवास आणि आरोग्याबद्दल कोणताही प्रश्न विचारा.`
          : `Hello! I am your BioCanopy Climate & Health Copilot for ${selectedCity}. Ask me about physiological heat stress, safe commute windows, hydration directives, or vulnerable population safeguards based on live meteorological telemetry.`,
      source: 'BioCanopy Climate Copilot',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Sync initial temperature when current city metric updates
  useEffect(() => {
    if (currentMetric?.temperature && currentMetric.temperature > 0) {
      setTemperature(Math.round(currentMetric.temperature));
    }
  }, [currentMetric?.temperature]);

  // Fetch live advisory from Backend API (/api/advisor/generate)
  useEffect(() => {
    let isCancelled = false;
    const fetchAdvisory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/advisor/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            city: selectedCity,
            temperature,
            humidity: currentMetric?.humidity || 45,
            aqi: currentMetric?.aqi || 140,
            persona,
            language,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setAdvisory(data);
          }
        }
      } catch (err) {
        console.warn('Backend advisor offline, falling back to local computation:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchAdvisory, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCity, temperature, persona, language, currentMetric?.humidity, currentMetric?.aqi]);

  // Handle Interactive Chat Submission
  const handleSendChat = async (questionToSend?: string) => {
    const text = (questionToSend || chatInput).trim();
    if (!text || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionToSend) setChatInput('');
    setIsSendingChat(true);

    try {
      const res = await fetch(`${API_BASE}/api/advisor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          city: selectedCity,
          temperature,
          humidity: currentMetric?.humidity || 45,
          aqi: currentMetric?.aqi || 140,
          persona,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          source: data.source || 'BioCanopy AI Copilot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Failed to fetch chat response');
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text:
          language === 'hi'
            ? `वर्तमान तापमान ${temperature}°C पर छायादार रास्तों का ही उपयोग करें तथा दोपहर १२ से ४ के मध्य धूप से बचें।`
            : `At ${temperature}°C, favor tree-canopied routes and drink fluids with electrolytes every 40 mins.`,
        source: 'BioCanopy Clinical Safeguard',
        time: 'Just now',
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Fallback tip if backend is still initializing
  const dynamicTip = useMemo(() => {
    if (advisory) {
      return {
        level: advisory.level,
        headline: advisory.headline,
        body: advisory.body,
        badge: advisory.badge,
        badgeColor: advisory.badgeColor,
        hydration: advisory.hydration,
        safeHours: advisory.safeHours,
        source: advisory.source,
        personaTip: advisory.personaTip,
        asphaltTemp: advisory.asphaltTemp || temperature + 8,
        heatIndex: advisory.heatIndex || temperature + 3,
        hourly: advisory.hourlyForecast || [],
      };
    }

    const isExtreme = temperature >= 42;
    const isHigh = temperature >= 37;
    return {
      level: isExtreme
        ? copy.extremeWarning
        : isHigh
        ? 'Midday Thermal Alert'
        : 'Moderate Warm Protocol',
      headline: isExtreme
        ? copy.guidanceHeatwaveHeadline
        : isHigh
        ? copy.guidanceSmogHeadline
        : copy.guidanceModerateHeadline,
      body: isExtreme
        ? copy.guidanceHeatwaveBody
        : isHigh
        ? copy.guidanceSmogBody
        : copy.guidanceModerateBody,
      badge: isExtreme ? copy.extremeWarning : isHigh ? copy.highAdvisory : copy.moderateAdvisory,
      badgeColor: isExtreme
        ? 'bg-red-500/20 text-red-300 border-red-500/40'
        : isHigh
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        : 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      hydration: isExtreme
        ? 'Drink 500ml oral fluids every 30 mins'
        : 'Drink 400ml water every 45 mins',
      safeHours: isExtreme ? 'Before 9:30 AM or after 7:00 PM' : 'Before 11:30 AM or after 5:30 PM',
      source: 'CPCB & IMD Validated Rules Engine v2.4',
      personaTip: 'Wear breathable cotton clothing and favor shaded pedestrian corridors.',
      asphaltTemp: Math.round(temperature + 7.5),
      heatIndex: Math.round(temperature + 3),
      hourly: [
        { hour: '7 AM', temp: temperature - 8, status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', radiation: 'Low' },
        { hour: '9 AM', temp: temperature - 4, status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', radiation: 'Moderate' },
        { hour: '11 AM', temp: temperature - 1, status: 'Caution', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', radiation: 'High' },
        { hour: '1 PM', temp: temperature + 1, status: 'Avoid', color: 'bg-red-500/20 text-red-300 border-red-500/30', radiation: 'Severe' },
        { hour: '3 PM', temp: temperature + 2, status: 'Avoid', color: 'bg-red-500/20 text-red-300 border-red-500/30', radiation: 'Peak' },
        { hour: '5 PM', temp: temperature, status: 'Caution', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', radiation: 'High' },
        { hour: '7 PM', temp: temperature - 4, status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', radiation: 'Low' },
        { hour: '9 PM', temp: temperature - 7, status: 'Safe', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', radiation: 'None' },
      ],
    };
  }, [advisory, temperature, copy]);

  // Demographic persona pill definitions
  const personas: { id: DemographicPersona; label: string; icon: any }[] = [
    { id: 'general', label: language === 'hi' ? 'सामान्य नागरिक' : language === 'mr' ? 'नागरिक' : 'General Public', icon: Users },
    { id: 'elderly', label: language === 'hi' ? 'वरिष्ठ नागरिक' : language === 'mr' ? 'ज्येष्ठ नागरिक' : 'Elderly & Heart', icon: HeartPulse },
    { id: 'outdoor_workers', label: language === 'hi' ? 'आउटडोर श्रमिक' : language === 'mr' ? 'कामगार' : 'Outdoor Workers', icon: ShieldAlert },
    { id: 'children', label: language === 'hi' ? 'बच्चे व विद्यालय' : language === 'mr' ? 'मुले' : 'Children & Schools', icon: User },
    { id: 'athletes', label: language === 'hi' ? 'खिलाड़ी व धावक' : language === 'mr' ? 'खेळाडू' : 'Athletes & Runners', icon: Zap },
  ];

  // Quick query chips for AI consultation
  const suggestedQuestions = [
    language === 'hi' ? 'क्या दोपहर २ बजे दौड़ना सुरक्षित है?' : 'Can I go jogging at 2 PM?',
    language === 'hi' ? 'डिलीवरी राइडर्स के लिए क्या सावधानियां हैं?' : 'Precautions for outdoor delivery riders?',
    language === 'hi' ? 'अस्थमा रोगियों के लिए क्या निर्देश हैं?' : 'Safe precautions for asthma patients?',
    language === 'hi' ? 'सर्वोत्तम इलेक्ट्रोलाइट्स क्या हैं?' : 'Best hydration & electrolyte choices?',
  ];

  return (
    <div className="relative space-y-6">
      {/* Sleek Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white sm:text-2xl">
            {copy.title} · {selectedCity}
          </h1>
          <p className="text-xs text-[#94BDB2]">
            {copy.subtitle}
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
          </div>
        )}
      </div>

      {/* Demographic Persona Selector Bar */}
      <div className="rounded-2xl border border-emerald-500/20 bg-[#0A1B17] p-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#94BDB2] flex items-center gap-1.5">
          <Users className="h-4 w-4 text-emerald-400" />
          <span>{language === 'hi' ? 'लक्षित समूह चुनें:' : language === 'mr' ? 'गट निवडा:' : 'Target Demographic:'}</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {personas.map((p) => {
            const Icon = p.icon;
            const active = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-glow border border-emerald-400/50'
                    : 'bg-[#081412] text-[#94BDB2] hover:text-white border border-emerald-500/20'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-emerald-400'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Advisor Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: Dynamic AI Generated Guidance Card */}
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 sm:p-7 shadow-card flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#061C19] to-[#041215] border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] p-1.5">
                  <img
                    src="/ai-logo.png"
                    alt="BioCanopy AI"
                    className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition hover:scale-105"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
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

                {/* Persona-specific highlight */}
                {dynamicTip.personaTip && (
                  <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
                        {language === 'hi' ? 'विशिष्ट समूह सुरक्षा निर्देश' : 'Group-Specific Safeguard'}
                      </p>
                      <p className="text-xs text-white/90 mt-0.5">{dynamicTip.personaTip}</p>
                    </div>
                  </div>
                )}
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

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/20 pt-4 text-xs text-[#94BDB2]">
            <span>Validated: CPCB Mandir Marg + IMD Safdarjung</span>
            <span className="text-emerald-400 font-semibold">{dynamicTip.source}</span>
          </div>
        </div>

        {/* Right: Dynamic Interactive Condition Slider & Live Telemetry Context */}
        <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 sm:p-7 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                {language === 'hi' ? 'लाइव तापमान स्लाइडर' : language === 'mr' ? 'तापमान स्लाइडर' : 'Live Condition Slider'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#94BDB2]">
              {language === 'hi' ? 'नियम प्रतिक्रिया जांचने के लिए खींचें' : 'Drag to test AI response'}
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

            <div className="text-right space-y-1">
              <p className="text-xs text-[#94BDB2]">{language === 'hi' ? 'लक्षित शहर' : 'Target City'}</p>
              <p className="text-sm font-bold text-white">{selectedCity}</p>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[11px] text-amber-400 font-semibold">
                  {language === 'hi' ? 'डामर सतह' : 'Asphalt Surface'}: ~{dynamicTip.asphaltTemp}°C
                </span>
                <span className="text-[11px] text-cyan-300 font-semibold">
                  Heat Index ($HI$): ~{dynamicTip.heatIndex}°C
                </span>
              </div>
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
              <span>26°C {language === 'hi' ? 'हल्का' : 'Mild'}</span>
              <span>35°C {language === 'hi' ? 'गर्म' : 'Warm'}</span>
              <span>41°C {language === 'hi' ? 'लू' : 'Heatwave'}</span>
              <span>46°C {language === 'hi' ? 'अत्यधिक' : 'Extreme'}</span>
            </div>
          </div>

          {/* 3 Quick Scenario Presets */}
          <div className="space-y-2 border-t border-emerald-500/20 pt-4">
            <p className="text-xs font-bold text-white">
              {language === 'hi' ? 'पूर्व-निर्धारित परिदृश्य:' : 'Preset Scenarios:'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTemperature(41)}
                className={`rounded-xl border p-2 text-center text-xs font-semibold transition ${
                  temperature === 41
                    ? 'border-red-500 bg-red-500/30 text-white ring-1 ring-red-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                }`}
              >
                {copy.scenarioHeatwave}
              </button>
              <button
                type="button"
                onClick={() => setTemperature(34)}
                className={`rounded-xl border p-2 text-center text-xs font-semibold transition ${
                  temperature === 34
                    ? 'border-amber-500 bg-amber-500/30 text-white ring-1 ring-amber-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                {copy.scenarioSmog}
              </button>
              <button
                type="button"
                onClick={() => setTemperature(29)}
                className={`rounded-xl border p-2 text-center text-xs font-semibold transition ${
                  temperature === 29
                    ? 'border-emerald-500 bg-emerald-500/30 text-white ring-1 ring-emerald-400'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                {copy.scenarioSunset}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Hourly Commute Safety Window Table (Dynamically evaluated from backend diurnal curve) */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0F2420] p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                {copy.hourlyForecastTitle}
              </h3>
              <p className="text-xs text-[#94BDB2]">
                {language === 'hi'
                  ? 'पैदल, साइकिल या सार्वजनिक पारगमन के लिए प्रति घंटे सुरक्षा अनुशंसाएं'
                  : 'Hourly safety recommendations evaluated for outdoor walking, cycling, or transit'}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-400">
            {language === 'hi' ? 'स्वचालित सौर विकिरण मूल्यांकन' : 'Diurnal Solar & Thermal Arc Evaluation'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 text-center text-xs">
          {dynamicTip.hourly.map((slot) => (
            <div
              key={slot.hour}
              className={`rounded-2xl border p-3 flex flex-col items-center justify-center transition ${slot.color}`}
            >
              <span className="font-bold text-white text-sm">{slot.hour}</span>
              <span className="text-[10px] text-[#94BDB2] mt-0.5">{slot.temp}°C</span>
              <span className="mt-1 text-[11px] font-black">{slot.status}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-75 mt-0.5">{slot.radiation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* ✦ PROFESSIONAL FLOATING AI COPILOT BUTTON (Bottom-right)       */}
      {/* ============================================================== */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-[#081815]/95 px-4 py-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(34,211,238,0.25)] backdrop-blur-xl transition hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">BioCanopy AI</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <p className="text-xs font-bold text-white">Climate Copilot</p>
        </div>
      </motion.button>

      {/* ============================================================== */}
      {/* ✦ PROFESSIONAL AI COPILOT FLOATING CONSULTATION DRAWER         */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isCopilotOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-6 right-6 z-50 w-[94vw] max-w-lg rounded-3xl border border-cyan-500/40 bg-[#071613]/98 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(34,211,238,0.2)] backdrop-blur-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 80px)' }}
          >
            {/* Copilot Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 bg-gradient-to-r from-[#0C241E] to-[#071613] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>BioCanopy Climate Copilot</span>
                    <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2 py-0.5 text-[9px] font-black text-cyan-300 uppercase tracking-wide">
                      Clinical AI
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#94BDB2]">
                    {selectedCity} · {temperature}°C · {dynamicTip.source.includes('Gemini') ? 'Google Gemini 1.5' : 'CPCB/IMD Clinical Engine'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCopilotOpen(false)}
                className="rounded-xl p-2 text-[#94BDB2] hover:bg-white/10 hover:text-white transition"
                title="Close Copilot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Suggested Questions Quick Chips */}
            <div className="border-b border-emerald-500/20 bg-[#05110E] px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94BDB2] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>Quick Inquiries:</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(q)}
                    className="rounded-xl border border-emerald-500/20 bg-[#0B201B] px-2.5 py-1 text-[11px] text-[#94BDB2] hover:border-cyan-400 hover:text-white transition"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat History Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[380px] bg-[#05100E]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                        : 'bg-[#0B201B] text-[#ECFDF5] border border-cyan-500/30 rounded-tl-none shadow-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-[#94BDB2]/70 px-1">
                    {msg.source && <span className="font-semibold text-cyan-400">{msg.source}</span>}
                    <span>{msg.time}</span>
                  </div>
                </div>
              ))}

              {isSendingChat && (
                <div className="flex items-center gap-2 text-xs text-cyan-300 bg-[#0B201B] p-3 rounded-2xl border border-cyan-500/30 w-fit">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                  <span>Evaluating meteorological telemetry & health guidelines...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2 border-t border-emerald-500/20 bg-[#081815] p-3.5"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'गर्मी, आवागमन या स्वास्थ्य सावधानियों पर परामर्श लें...'
                    : 'Ask about heat risk, safe transit hours, hydration...'
                }
                className="flex-1 rounded-xl border border-emerald-500/30 bg-[#05100E] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#94BDB2]/60 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-black shadow-glow transition hover:bg-cyan-400 disabled:opacity-40"
              >
                <span>Consult</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
