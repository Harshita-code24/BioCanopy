import React from 'react';
import { useAppState } from '../../store/AppStateContext';

/**
 * Animated Leaf SVG element with gradient shading & natural veins
 */
function FloatingLeaf({
  className = '',
  style = {},
  size = 28,
  fillGradient = 'leafGrad1',
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  fillGradient?: string;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style}>
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 32 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
          <linearGradient id="leafGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
        </defs>

        {/* Leaf Outline & Body */}
        <path
          d="M16 2C8 9 2 18 3 28C4 36 10 40 16 41C22 40 28 36 29 28C30 18 24 9 16 2Z"
          fill={`url(#${fillGradient})`}
        />

        {/* Leaf Center Stem / Main Vein */}
        <path
          d="M16 4C16 16 16 32 16 40"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Lateral Side Veins */}
        <path
          d="M16 12C12 10 9 12 7 14M16 18C11 16 8 18 6 21M16 24C12 23 9 25 8 28"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M16 12C20 10 23 12 25 14M16 18C21 16 24 18 26 21M16 24C20 23 23 25 24 28"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Animated Bubble SVG element
 */
function TranslucentBubble({
  size = 24,
  className = '',
  style = {},
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(255, 255, 255, 0.65)"
          strokeWidth="1.2"
          fill="rgba(255, 255, 255, 0.08)"
          className="backdrop-blur-[1px]"
        />
        {/* Curved light reflection highlight */}
        <path
          d="M7 8C8 6.5 9.5 5.5 11.5 5.5"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="1.2" fill="rgba(255, 255, 255, 0.6)" />
      </svg>
    </div>
  );
}

/**
 * Animated Star Sparkle / Glint
 */
function SparkleStar({
  size = 18,
  className = '',
  style = {},
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
          fill="white"
          opacity="0.95"
          className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
        />
      </svg>
    </div>
  );
}

export function AnimatedCanopyBackground() {
  const { theme } = useAppState();

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Landscape Photo Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-[1.02]"
        style={{
          backgroundImage: `url('/canopy-breeze-bg.jpg')`,
        }}
      />

      {/* 2. Glass Aesthetic Layer (Adapts dynamically between Dark & Light themes) */}
      {theme === 'dark' ? (
        /* Dark Theme: Rich obsidian & emerald glass glaze allowing mountains, sky glow, and foliage to shine through */
        <div className="absolute inset-0 bg-gradient-to-b from-[#081412]/82 via-[#081412]/74 to-[#050D0C]/88 transition-colors duration-700 backdrop-blur-[0.5px]">
          {/* Subtle ambient cyan/emerald light rays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-black/30" />
        </div>
      ) : (
        /* Light Theme: Radiant daylight glass glaze with clean frosted freshness */
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/22 to-white/42 transition-colors duration-700 backdrop-blur-[0.5px]">
          {/* Gentle sunbeam glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200/15 via-emerald-100/10 to-transparent" />
        </div>
      )}

      {/* 3. Flowing Glass Breeze Ribbons (Smooth Animated SVG Streamers) */}
      <div className="absolute inset-0 flex items-center justify-center animate-breeze-wave opacity-80">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="breezeGlass1" x1="0%" y1="30%" x2="100%" y2="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#A7F3D0" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#6EE7B7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="breezeGlass2" x1="0%" y1="70%" x2="100%" y2="30%">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#34D399" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>

            <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Upper Graceful Glass Ribbon */}
          <path
            d="M-40 280 C 220 180, 520 40, 820 160 C 1120 280, 1340 100, 1500 130"
            stroke="url(#breezeGlass1)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#ribbonGlow)"
            className="animate-breeze-pulse"
          />

          {/* Lower Sweeping Glass Ribbon with Translucent Fill */}
          <path
            d="M-50 480 C 180 620, 360 840, 680 820 C 1020 800, 1260 620, 1520 540"
            stroke="url(#breezeGlass2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#ribbonGlow)"
            className="animate-breeze-pulse-delayed"
          />

          {/* Cross Wind Secondary Ribbon */}
          <path
            d="M-20 620 C 320 680, 640 880, 960 760 C 1240 660, 1420 590, 1500 560"
            stroke="url(#breezeGlass1)"
            strokeWidth="1.8"
            strokeDasharray="16 12"
            opacity="0.65"
            filter="url(#ribbonGlow)"
          />
        </svg>
      </div>

      {/* 4. Sparkling Light Glints / Stars along the Breeze Stream */}
      <SparkleStar size={20} className="top-[22%] left-[34%] animate-sparkle-1" />
      <SparkleStar size={16} className="top-[68%] left-[72%] animate-sparkle-2" />
      <SparkleStar size={22} className="top-[62%] left-[48%] animate-sparkle-3" />
      <SparkleStar size={14} className="top-[18%] left-[82%] animate-sparkle-1" />

      {/* 5. Translucent Floating Bubbles / Dewdrops */}
      <TranslucentBubble size={32} className="top-[28%] left-[12%] animate-bubble-float-1" />
      <TranslucentBubble size={24} className="top-[58%] left-[14%] animate-bubble-float-2" />
      <TranslucentBubble size={30} className="top-[41%] right-[9%] animate-bubble-float-3" />
      <TranslucentBubble size={20} className="top-[16%] right-[22%] animate-bubble-float-1" />

      {/* 6. Animated Floating Green Leaves (Dancing in the Breeze across depths) */}
      {/* Wave 1: Drifting from lower-left across the center */}
      <FloatingLeaf
        size={30}
        fillGradient="leafGrad1"
        className="animate-leaf-drift-1"
        style={{ animationDelay: '0s', animationDuration: '16s' }}
      />
      <FloatingLeaf
        size={22}
        fillGradient="leafGrad2"
        className="animate-leaf-drift-2"
        style={{ animationDelay: '3.5s', animationDuration: '18s' }}
      />
      <FloatingLeaf
        size={34}
        fillGradient="leafGrad3"
        className="animate-leaf-drift-3"
        style={{ animationDelay: '7s', animationDuration: '20s' }}
      />

      {/* Wave 2: Staggered continuous drift */}
      <FloatingLeaf
        size={26}
        fillGradient="leafGrad1"
        className="animate-leaf-drift-1"
        style={{ animationDelay: '9s', animationDuration: '17s' }}
      />
      <FloatingLeaf
        size={20}
        fillGradient="leafGrad2"
        className="animate-leaf-drift-2"
        style={{ animationDelay: '12s', animationDuration: '19s' }}
      />
      <FloatingLeaf
        size={32}
        fillGradient="leafGrad3"
        className="animate-leaf-drift-3"
        style={{ animationDelay: '15s', animationDuration: '22s' }}
      />

      {/* 7. Corner Framing Leaves with Gentle Ambient Sway */}
      {/* Top Left Corner Foliage Sway */}
      <div className="absolute -top-6 -left-6 opacity-85 animate-corner-leaf origin-top-left pointer-events-none">
        <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
          <path
            d="M0 0 C30 20, 60 50, 75 85 C60 70, 30 50, 0 45 Z"
            fill="#15803D"
            opacity="0.8"
          />
          <path
            d="M10 0 C40 30, 80 40, 95 65 C75 55, 45 40, 15 25 Z"
            fill="#22C55E"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Bottom Left Corner Foliage Sway */}
      <div className="absolute -bottom-6 -left-6 opacity-85 animate-corner-leaf-delayed origin-bottom-left pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 100 100" fill="none">
          <path
            d="M0 100 C35 75, 65 55, 85 20 C65 40, 40 65, 0 75 Z"
            fill="#166534"
            opacity="0.85"
          />
          <path
            d="M15 100 C45 70, 75 60, 95 35 C75 50, 50 70, 25 85 Z"
            fill="#15803D"
            opacity="0.75"
          />
        </svg>
      </div>
    </div>
  );
}
