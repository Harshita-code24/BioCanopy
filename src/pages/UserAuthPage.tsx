import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Lock,
  Mail,
  Trees,
  User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedCanopyBackground } from '../components/shared/AnimatedCanopyBackground';
import { useAuth } from '../store/AuthContext';

export function UserAuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('Neha Resident');
  const [email, setEmail] = useState('neha.resident@biocanopy.demo');
  const [password, setPassword] = useState('citizen123');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: mode === 'signup' ? name : 'Neha Resident',
      email: mode === 'signup' ? email : 'neha.resident@biocanopy.demo',
      role: 'citizen' as const,
    };

    if (mode === 'signup') {
      signup(payload);
    } else {
      login(payload);
    }
    navigate('/dashboard');
  };

  const handleQuickDemo = () => {
    login({
      name: 'Neha Resident',
      email: 'neha.resident@biocanopy.demo',
      role: 'citizen',
    });
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen text-[#ECFDF5] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Dynamic Animated Scenic Landscape & Leaves Background */}
      <AnimatedCanopyBackground />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        {/* BioCanopy Brand & Simple Tagline on Top */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-glow mb-3">
            <Trees className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Bio<span className="text-emerald-400">Canopy</span>
          </h1>
          <p className="mt-2 text-sm text-[#94BDB2] font-medium tracking-wide">
            Air quality and heat
          </p>
        </div>

        {/* Centered Frosted Glass Auth Card */}
        <div className="w-full rounded-3xl border border-emerald-500/30 bg-[#0F2420]/75 p-6 sm:p-8 shadow-elevated backdrop-blur-2xl">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#081412] p-1 border border-emerald-500/20">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl py-2 text-xs font-bold transition ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-xl py-2 text-xs font-bold transition ${
                mode === 'signup'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[#94BDB2] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
                  Full Name
                </label>
                <div className="relative mt-1.5">
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
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
                Email Address
              </label>
              <div className="relative mt-1.5">
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94BDB2]">
                Password
              </label>
              <div className="relative mt-1.5">
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

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-glow transition hover:bg-emerald-500 active:scale-95"
            >
              {mode === 'login' ? 'Sign In to BioCanopy' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo 1-Click Action */}
          <div className="mt-5 border-t border-emerald-500/20 pt-4">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>One-Click Demo as Citizen (Neha Resident)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
