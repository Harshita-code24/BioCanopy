import React from 'react';

/**
 * Grey cloud with lightning for Dark Theme
 */
export function GreyCloudLightningIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Grey cloud with lightning (Dark Theme)"
    >
      <defs>
        <filter id="boltGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FACC15" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Grey Cloud Body */}
      <path
        d="M17.5 16.5H18a4 4 0 0 0 0-8c-.3 0-.6.03-.9.08A6 6 0 0 0 6 11.5c0 .3.02.6.06.9A4.5 4.5 0 0 0 7 21h3"
        stroke="#94A3B8"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#475569"
        fillOpacity="0.45"
      />

      {/* Electric Yellow Lightning Bolt */}
      <path
        d="M13 10.5l-3.2 5.5h3.8l-1.8 6 5.2-7.5h-3.8l2.8-4h-3z"
        fill="#FACC15"
        stroke="#EAB308"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#boltGlow)"
      />
    </svg>
  );
}

/**
 * White cloud with sun peeking through it for Light Theme
 */
export function WhiteCloudSunIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="White cloud with sun peeking through (Light Theme)"
    >
      <defs>
        <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.7" />
        </filter>
        <filter id="cloudShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Sun peeking from behind the cloud (Top-Right) */}
      <g filter="url(#sunGlow)">
        {/* Sun disk */}
        <circle cx="16.5" cy="7.5" r="3.75" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
        {/* Radiating sunbeams */}
        <path
          d="M16.5 1.75v1.75M22.25 7.5h-1.75M20.5 3.5l-1.25 1.25M20.5 11.5l-1.25-1.25"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Crisp White Cloud in foreground */}
      <path
        d="M6.5 19.5h10a4 4 0 0 0 1-7.85 5.5 5.5 0 0 0-10.8-1.5A3.8 3.8 0 0 0 6.5 19.5z"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cloudShadow)"
      />
    </svg>
  );
}
