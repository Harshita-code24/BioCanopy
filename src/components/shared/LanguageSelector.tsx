import { Check, ChevronDown, Globe } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useAppState } from '../../store/AppStateContext';
import type { Language } from '../../types';

export const SUPPORTED_LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export function LanguageSelector({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useAppState();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#0F2420] px-3 py-1.5 text-xs font-bold text-white transition hover:border-emerald-400 focus:outline-none"
        title="Select Language / भाषा चुनें"
      >
        <Globe className="h-3.5 w-3.5 text-emerald-400" />
        <span className="font-semibold">{currentLang.native}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#94BDB2] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-emerald-500/30 bg-[#0F2420] p-1.5 shadow-2xl z-[1001] backdrop-blur-xl">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94BDB2]/70">
            Language / भाषा
          </div>
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[#94BDB2] hover:bg-emerald-500/15 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{item.native}</span>
                  <span className="text-[10px] opacity-70 font-mono">({item.label})</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-emerald-200" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
