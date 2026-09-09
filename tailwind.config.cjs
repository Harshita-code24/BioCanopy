/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canopy: {
          // Deep Obsidian & Dark Forest Canvas
          base: '#081412',
          'base-dark': '#050D0C',
          canvas: '#081412',
          surface: '#0F2420',
          'surface-light': '#14302A',
          card: '#0F2420',
          
          // High-tech Emerald & Mint Neon Glows
          emerald: '#10B981',
          'emerald-light': '#34D399',
          'emerald-glow': '#2DD4BF',
          teal: '#2DD4BF',
          green: '#22C55E',
          'green-light': '#4ADE80',

          // High-contrast text on dark background
          text: '#ECFDF5',
          'text-bright': '#FFFFFF',
          muted: '#94BDB2',
          'muted-light': '#A7F3D0',
          border: 'rgba(45, 212, 191, 0.18)',
          'border-strong': 'rgba(45, 212, 191, 0.35)',

          // Three-band simplification status scale
          amber: '#F59E0B',
          'amber-light': '#FBBF24',
          red: '#EF4444',
          'red-light': '#F87171',
        },
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(45, 212, 191, 0.12)',
        elevated: '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(45, 212, 191, 0.2)',
        glow: '0 0 0 1px rgba(45, 212, 191, 0.25), 0 0 20px rgba(16, 185, 129, 0.15)',
        'glow-strong': '0 0 0 2px rgba(45, 212, 191, 0.4), 0 0 30px rgba(16, 185, 129, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite',
        beacon: 'beacon 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(0.97)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        beacon: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
