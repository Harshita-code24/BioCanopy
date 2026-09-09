import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiocanopyLogo } from '../components/layout/BiocanopyLogo';
import { GlassCard } from '../components/shared/GlassCard';
import { defaultUser, useAuth } from '../store/AuthContext';
import type { Role } from '../types';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<Role>('citizen');
  const [name, setName] = useState('Neha Resident');
  const [email, setEmail] = useState('citizen@biocanopy.demo');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const submit = () => {
    const seeded = defaultUser(role);
    const payload = {
      name: mode === 'signup' ? name : seeded.name,
      email: mode === 'signup' ? email : seeded.email,
      role,
    };

    if (mode === 'signup') {
      signup(payload);
    } else {
      login(payload);
    }

    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canopy-base px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.12),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(74,222,128,0.12),transparent_25%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <GlassCard className="flex flex-col justify-between p-8">
          <div>
            <div className="flex items-center gap-4">
              <BiocanopyLogo className="h-14 w-14" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-canopy-teal">
                  BIOCANOPY
                </p>
                <h1 className="mt-2 text-3xl font-semibold">
                  Enter the heat resilience demo
                </h1>
              </div>
            </div>
            <p className="mt-6 max-w-md text-base leading-8 text-canopy-muted">
              Switch between Citizen and Admin views to demo reporting,
              analysis, routing, and action workflows without a backend.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FeaturePill label="Citizen demo" detail="Report heat spots live" />
            <FeaturePill label="Admin demo" detail="Filter and prioritize action" />
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="mx-auto max-w-xl">
            <div className="rounded-full border border-canopy-border/60 bg-canopy-base/70 p-1">
              <div className="grid grid-cols-2 gap-1">
                {(['login', 'signup'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setMode(item)}
                    className={[
                      'rounded-full px-4 py-3 text-sm font-medium transition',
                      mode === item
                        ? 'bg-canopy-teal text-canopy-base shadow-glow'
                        : 'text-canopy-muted',
                    ].join(' ')}
                  >
                    {item === 'login' ? 'Login' : 'Signup'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-canopy-teal">
                Select role
              </p>
              <div className="inline-flex rounded-full border border-canopy-border/60 bg-canopy-base/70 p-1">
                {(['citizen', 'admin'] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setRole(item);
                      const seeded = defaultUser(item);
                      setName(seeded.name);
                      setEmail(seeded.email);
                    }}
                    className={[
                      'rounded-full px-5 py-2.5 text-sm capitalize transition',
                      role === item
                        ? 'bg-canopy-green text-canopy-base shadow-glow'
                        : 'text-canopy-muted',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <Field
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Enter your name"
              />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
              />
              <Field
                label="Password"
                value="demo1234"
                onChange={() => undefined}
                placeholder="Demo password"
                type="password"
              />
            </div>

            <button
              onClick={submit}
              className="mt-8 w-full rounded-2xl bg-canopy-teal px-5 py-4 font-semibold text-canopy-base shadow-glow-strong transition hover:scale-[1.01]"
            >
              {mode === 'login' ? 'Enter Dashboard' : 'Create Demo Account'}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function FeaturePill({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-canopy-border/50 bg-canopy-base/60 p-4">
      <p className="text-lg font-semibold text-canopy-text">{label}</p>
      <p className="mt-2 text-sm text-canopy-muted">{detail}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="space-y-2 text-sm text-canopy-muted">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-canopy-border/60 bg-canopy-base px-4 py-4 text-canopy-text shadow-[0_0_0_0_rgba(45,212,191,0)] transition focus:border-canopy-teal focus:shadow-[0_0_0_4px_rgba(45,212,191,0.12)]"
      />
    </label>
  );
}
