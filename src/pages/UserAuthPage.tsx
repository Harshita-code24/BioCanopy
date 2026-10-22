import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Trees,
  User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedCanopyBackground } from '../components/shared/AnimatedCanopyBackground';
import { useTranslation } from '../i18n/useTranslation';
import { useAppState } from '../store/AppStateContext';
import { useAuth } from '../store/AuthContext';

const AVAILABLE_CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad'];

export function UserAuthPage() {
  const { language, setLanguage, selectedCity, setSelectedCity, showToast } = useAppState();
  const { t } = useTranslation();
  const copy = t.auth;
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('Neha Resident');
  const [city, setCity] = useState(selectedCity || 'Delhi');
  const [email, setEmail] = useState('neha.resident@biocanopy.demo');
  const [password, setPassword] = useState('citizen123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSentAlert, setEmailSentAlert] = useState<string | null>(null);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleModeChange = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    if (newMode === 'signup') {
      setName('');
      setEmail('');
      setPassword('');
      setCity(selectedCity || 'Delhi');
    } else {
      setName('Neha Resident');
      setEmail('neha.resident@biocanopy.demo');
      setPassword('citizen123');
      setCity(selectedCity || 'Delhi');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const res = await signup({ name, email, password, city });
        if (res.success) {
          setSelectedCity(city);
          const isAdmin = email.toLowerCase().includes('admin');
          if (!isAdmin) {
            setEmailSentAlert(email);
            showToast(`📧 ${copy.welcomeEmailSent} ${email}`, 'success');
            setTimeout(() => {
              navigate('/dashboard');
            }, 1800);
          } else {
            navigate('/admin');
          }
        } else {
          setErrorMessage(res.message || 'Failed to create account.');
        }
      } else {
        const res = await login({ email, password });
        if (res.success) {
          if (res.user?.city) {
            setSelectedCity(res.user.city);
          }
          if (email.toLowerCase().includes('admin')) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setErrorMessage(res.message || 'Invalid email or password.');
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await login({
        name: 'Neha Resident',
        email: 'neha.resident@biocanopy.demo',
        password: 'citizen123',
        city: 'Delhi',
      });
      setSelectedCity('Delhi');
      if (res.success) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch {
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminDemo = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await login({
        name: 'Admin (BioCanopy Team)',
        email: 'admin@biocanopy.demo',
        password: 'admin123',
        city: 'Delhi',
      });
      setSelectedCity('Delhi');
      if (res.success) {
        navigate('/admin');
      } else {
        navigate('/admin');
      }
    } catch {
      navigate('/admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-[#ECFDF5] flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Dynamic Animated Scenic Landscape & Leaves Background */}
      <AnimatedCanopyBackground />

      {/* Language Switcher Pill pinned at Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-2xl bg-[#081412]/80 p-1 border border-emerald-500/20 backdrop-blur-md">
        {[
          { code: 'en', label: 'English' },
          { code: 'hi', label: 'हिन्दी' },
          { code: 'mr', label: 'मराठी' },
        ].map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code as any)}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition ${
              language === lang.code
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94BDB2] hover:text-white'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* BioCanopy Brand Logo and Clean Title */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow mb-2.5">
            <Trees className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Bio<span className="text-emerald-400">Canopy</span>
          </h1>
        </div>

        {/* Centered Frosted Glass Auth Card */}
        <div className="w-full rounded-3xl border border-emerald-500/30 bg-[#0F2420]/80 p-5 sm:p-7 shadow-elevated backdrop-blur-2xl">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#081412] p-1 border border-emerald-500/20">
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className={`rounded-xl py-2 text-xs font-bold transition ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              {copy.tabSignIn}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('signup')}
              className={`rounded-xl py-2 text-xs font-bold transition ${
                mode === 'signup'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              {copy.tabCreateAccount}
            </button>
          </div>

          {/* Email Welcome Notice */}
          {emailSentAlert && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-400/40 bg-emerald-950/70 p-3 text-xs text-emerald-200"
            >
              <Inbox className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">✓ {copy.welcomeEmailSent}</p>
                <p className="text-[11px] text-[#94BDB2] mt-0.5">{copy.emailSentNotice}</p>
              </div>
            </motion.div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="mt-4 space-y-3.5">
            {/* 1. Name Input (Signup mode only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
                  {copy.fullName}
                </label>
                <div className="relative mt-1">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Neha Sharma"
                    className="w-full rounded-xl border border-emerald-500/30 bg-[#081412] py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-[#94BDB2]/50 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 2. City Selector (Signup registration only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
                  {copy.assignedCity}
                </label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-cyan-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-emerald-500/30 bg-[#081412] py-2.5 pl-10 pr-8 text-xs font-medium text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
                  >
                    {AVAILABLE_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-[#081412] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-3 text-[#94BDB2] text-xs">
                    ▼
                  </div>
                </div>
              </div>
            )}

            {/* 3. Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
                {copy.emailAddress}
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="resident@biocanopy.demo"
                  className="w-full rounded-xl border border-emerald-500/30 bg-[#081412] py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-[#94BDB2]/50 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
                {copy.password}
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-emerald-500/30 bg-[#081412] py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-[#94BDB2]/50 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-glow transition hover:bg-emerald-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{copy.signingIn}</span>
                </>
              ) : (
                <span>
                  {mode === 'login' ? copy.btnSignIn : copy.btnCreateAccount}
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo 1-Click Action */}
          <div className="mt-4 space-y-2 border-t border-emerald-500/20 pt-3">
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{copy.demoCitizen}</span>
            </button>

            <button
              type="button"
              onClick={handleAdminDemo}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>{copy.demoAdmin}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
