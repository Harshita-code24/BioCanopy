import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

const strokeByValue = (value: number) => {
  if (value >= 150) return '#F87171';
  if (value >= 80) return '#FBBF24';
  return '#4ADE80';
};

export function GaugeCard({
  label,
  value,
  suffix,
  max = 200,
}: {
  label: string;
  value: number;
  suffix: string;
  max?: number;
}) {
  const angle = Math.min(value / max, 1) * 270;
  const stroke = strokeByValue(value);

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute inset-x-8 top-0 h-20 rounded-full bg-canopy-teal/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4">
        <span className="text-sm uppercase tracking-[0.25em] text-canopy-muted">
          {label}
        </span>
        <div className="relative h-44 w-44">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-[135deg]">
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke="rgba(143,181,172,0.12)"
              strokeWidth="14"
              strokeDasharray="339 999"
              strokeLinecap="round"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke={stroke}
              strokeWidth="14"
              strokeDasharray="339 999"
              strokeDashoffset={339 - (339 * angle) / 270}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 339 }}
              animate={{ strokeDashoffset: 339 - (339 * angle) / 270 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 10px ${stroke})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-semibold text-canopy-text"
            >
              {value}
              <span className="ml-1 text-xl text-canopy-muted">{suffix}</span>
            </motion.div>
            <span className="mt-1 text-xs uppercase tracking-[0.3em] text-canopy-muted">
              live mock feed
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
