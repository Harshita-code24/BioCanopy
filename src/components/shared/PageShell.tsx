import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function PageShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-5 md:space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-canopy-teal">
            BIOCANOPY
          </p>
          <h1 className="text-2xl font-semibold text-canopy-text md:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-canopy-muted md:text-base">
            {subtitle}
          </p>
        </div>
        {actions ? <div className="w-full lg:w-auto">{actions}</div> : null}
      </div>
      {children}
    </motion.div>
  );
}
