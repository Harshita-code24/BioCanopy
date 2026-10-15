import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Trees,
  User as UserIcon,
  X,
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

  // Google Sign-In Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState('Neha Sharma');
  const [googleEmail, setGoogleEmail] = useState('neha.sharma.resident@gmail.com');
  const [googleCity, setGoogleCity] = useState(selectedCity || 'Delhi');
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState<string | null>(null);

  const { login, signup, googleLogin } = useAuth();
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
          navigate('/dashboard');
        } else {
          setErrorMessage(res.message || 'Failed to create account.');
        }
      } else {
        const res = await login({ email, password, name, city });
        if (res.success) {
          setSelectedCity(city);
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

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGoogleSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await googleLogin({
        name: googleName,
        email: googleEmail,
        city: googleCity,
      });

      if (res.success) {
        setSelectedCity(googleCity);
        const isAdmin = googleEmail.toLowerCase().includes('admin');

        // Constraint: "Make sure this email thing is only for users not admins."
        if (!isAdmin) {
          setEmailSentAlert(googleEmail);
          showToast(`📧 ${copy.welcomeEmailSent} ${googleEmail}`, 'success');
          // Short delay to let user see the email notice before navigation
          setTimeout(() => {
            setShowGoogleModal(false);
            navigate('/dashboard');
          }, 1600);
        } else {
          setShowGoogleModal(false);
          navigate('/admin');
        }
      } else {
        setErrorMessage(res.message || 'Google sign in failed.');
        setIsGoogleSubmitting(false);
      }
    } catch {
      setIsGoogleSubmitting(false);
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* Language Switcher Pill on Auth Screen */}
        <div className="mb-4 flex items-center gap-1 rounded-2xl bg-[#081412]/80 p-1 border border-emerald-500/20 backdrop-blur-md">
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

        {/* BioCanopy Brand & Simple Tagline on Top */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow mb-2.5">
            <Trees className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Bio<span className="text-emerald-400">Canopy</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#94BDB2] font-medium tracking-wide">
            {copy.subtitle}
          </p>
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

          {/* Error Message Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-950/70 p-3 text-xs font-medium text-red-200 backdrop-blur-md"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleAuth} className="mt-4 space-y-3.5">
            {/* 1. Full Name Input (Required for both login & signup as requested) */}
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
                  placeholder="e.g. Neha Resident"
                  className="w-full rounded-xl border border-emerald-500/30 bg-[#081412] py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-[#94BDB2]/50 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. City Dropdown Selector (Required for both login & signup as requested) */}
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

          {/* Divider with OR in 3 Languages */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-emerald-500/20 w-full" />
            <span className="bg-[#0F2420] px-3 text-[11px] font-bold text-[#94BDB2] uppercase tracking-wider shrink-0">
              {copy.orDivider}
            </span>
            <div className="border-t border-emerald-500/20 w-full" />
          </div>

          {/* "Sign in with Google" Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
          >
            {/* Official Multi-colored Google G Icon */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{copy.signInWithGoogle}</span>
          </button>

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

      {/* Google Sign-in Interactive Modal & Email Confirmation */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGoogleSubmitting && setShowGoogleModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-[#0C1F1B] p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                disabled={isGoogleSubmitting}
                className="absolute right-4 top-4 rounded-xl border border-emerald-500/20 bg-[#081412] p-1.5 text-[#94BDB2] hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Google Brand Header */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md mb-3">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white">
                  {copy.googleModalTitle}
                </h3>
                <p className="mt-1 text-xs text-[#94BDB2]">
                  {copy.googleModalDesc}
                </p>
              </div>

              {/* Email Sent Confirmation Banner */}
              {emailSentAlert && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 rounded-2xl border border-emerald-400/50 bg-emerald-950/80 p-3.5 text-xs text-emerald-200"
                >
                  <div className="flex items-start gap-2.5">
                    <Inbox className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">
                        ✓ {copy.welcomeEmailSent}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-emerald-300">
                        {emailSentAlert}
                      </p>
                      <p className="mt-1 text-[11px] text-[#94BDB2]">
                        {copy.emailSentNotice}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Google Account Form */}
              {!emailSentAlert && (
                <form onSubmit={handleGoogleSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#94BDB2] uppercase tracking-wider">
                      Google Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-[#081412] px-3.5 py-2 text-xs font-medium text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#94BDB2] uppercase tracking-wider">
                      Google Account Email
                    </label>
                    <input
                      type="email"
                      required
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-[#081412] px-3.5 py-2 text-xs font-medium text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#94BDB2] uppercase tracking-wider">
                      {copy.assignedCity}
                    </label>
                    <select
                      value={googleCity}
                      onChange={(e) => setGoogleCity(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/20 bg-[#081412] px-3.5 py-2 text-xs font-medium text-white focus:border-cyan-400 focus:outline-none"
                    >
                      {AVAILABLE_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#081412]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Note about citizen email dispatch */}
                  <div className="rounded-xl border border-emerald-500/20 bg-[#081412] p-2.5 text-[11px] text-[#94BDB2] flex items-center gap-2">
                    <Send className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>
                      A welcome confirmation email will be delivered to this address automatically (citizens only).
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isGoogleSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-bold text-white shadow-glow transition hover:from-emerald-400 hover:to-teal-500 active:scale-95 disabled:opacity-60"
                  >
                    {isGoogleSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing in & Dispatching Email...</span>
                      </>
                    ) : (
                      <span>{copy.continueGoogleBtn}</span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
