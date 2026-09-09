import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Map,
  ShieldCheck,
  Sparkles,
  Trees,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { featureCards } from '../data/mockData';
import { BiocanopyLogo } from '../components/layout/BiocanopyLogo';
import { GlassCard } from '../components/shared/GlassCard';

const icons = [Map, BarChart3, TriangleAlert, Sparkles, ShieldCheck];

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-canopy-base text-canopy-text">
      <header
        className={[
          'sticky top-0 z-30 border-b transition',
          scrolled
            ? 'border-canopy-border/50 bg-canopy-base/85 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <BiocanopyLogo />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-canopy-teal">
                BIOCANOPY
              </p>
              <p className="text-sm text-canopy-muted">
                Urban Heat + Air Quality Demo
              </p>
            </div>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full border border-canopy-teal/40 bg-canopy-teal/10 px-5 py-2.5 text-sm font-medium text-canopy-text shadow-glow transition hover:bg-canopy-teal/20"
          >
            Enter Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-canopy-teal/15 blur-3xl" />
        <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-canopy-green/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-canopy-teal/30 bg-canopy-surface/50 px-4 py-2 text-sm text-canopy-muted backdrop-blur"
            >
              <Trees className="h-4 w-4 text-canopy-green" />
              Frontend-only live presentation prototype
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 max-w-4xl text-5xl font-semibold leading-tight md:text-7xl"
            >
              Cooler routes, clearer data, faster heat action for Indian cities.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-canopy-muted"
            >
              BIOCANOPY shows how thermal mapping, citizen reporting, readable
              public data, and admin prioritization can work together in one
              climate resilience dashboard.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/auth"
                className="rounded-full bg-canopy-teal px-6 py-3 font-medium text-canopy-base shadow-glow-strong transition hover:scale-[1.02]"
              >
                Launch Demo
              </Link>
              <a
                href="#features"
                className="rounded-full border border-canopy-border/60 bg-canopy-surface/55 px-6 py-3 font-medium text-canopy-text"
              >
                Explore Features
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="rounded-[2rem] border border-canopy-border/60 bg-canopy-surface/55 p-6 shadow-glow backdrop-blur-xl"
          >
            <div className="rounded-[1.5rem] border border-canopy-border/50 bg-canopy-base/65 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-canopy-teal">
                    Demo Snapshot
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">Delhi Heat Pulse</h3>
                </div>
                <BiocanopyLogo className="h-16 w-16 animate-float" />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <Metric label="AQI" value="182" accent="text-canopy-red" />
                <Metric label="Tree Cover" value="18%" accent="text-canopy-green" />
                <Metric label="Cool Route" value="-34%" accent="text-canopy-teal" />
                <Metric label="Reports" value="21" accent="text-canopy-amber" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-canopy-teal">
            Feature Suite
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Five connected modules for one clear climate story
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {featureCards.map((feature, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <GlassCard className="group h-full min-h-56 transition hover:border-canopy-teal/40 hover:shadow-glow-strong">
                  <div className="flex h-full flex-col">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-canopy-teal/25 bg-canopy-teal/10 text-canopy-teal transition group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-canopy-muted">
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-canopy-border/50 bg-canopy-surface/40 p-4">
      <p className="text-sm text-canopy-muted">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
