import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-canopy-border/60 bg-canopy-surface/65 p-5 shadow-glow backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
