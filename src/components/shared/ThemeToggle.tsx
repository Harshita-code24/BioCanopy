import React from 'react';
import { useAppState } from '../../store/AppStateContext';
import { GreyCloudLightningIcon, WhiteCloudSunIcon } from './ThemeIcons';

interface ThemeToggleProps {
  variant?: 'pill' | 'button';
  className?: string;
}

export function ThemeToggle({ variant = 'pill', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useAppState();

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-3 py-1.5 text-xs font-bold transition hover:border-emerald-400 ${className}`}
        title={
          theme === 'dark'
            ? 'Dark Theme Active (Click to switch to Light Theme)'
            : 'Light Theme Active (Click to switch to Dark Theme)'
        }
      >
        {theme === 'dark' ? (
          <>
            <GreyCloudLightningIcon className="h-4 w-4" />
            <span className="text-slate-300 font-semibold">Dark</span>
          </>
        ) : (
          <>
            <WhiteCloudSunIcon className="h-4 w-4" />
            <span className="text-amber-600 font-semibold">Light</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-emerald-500/30 bg-[#0F2420] p-0.5 shadow-sm ${className}`}
      role="radiogroup"
      aria-label="Theme mode selection"
    >
      {/* Dark Theme Button: Grey Cloud with Lightning */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
          theme === 'dark'
            ? 'bg-emerald-600/30 text-white shadow-sm ring-1 ring-emerald-500/40'
            : 'text-[#94BDB2] hover:text-white opacity-70 hover:opacity-100'
        }`}
        title="Dark Theme (Grey cloud with lightning)"
      >
        <GreyCloudLightningIcon className="h-4 w-4" />
        <span className="hidden sm:inline text-[11px] font-bold">Dark</span>
      </button>

      {/* Light Theme Button: White Cloud with Sun Peeking Through */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
          theme === 'light'
            ? 'bg-amber-400/25 text-amber-300 shadow-sm ring-1 ring-amber-400/40'
            : 'text-[#94BDB2] hover:text-white opacity-70 hover:opacity-100'
        }`}
        title="Light Theme (White cloud with sun peeking through)"
      >
        <WhiteCloudSunIcon className="h-4 w-4" />
        <span className="hidden sm:inline text-[11px] font-bold">Light</span>
      </button>
    </div>
  );
}
