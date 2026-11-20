import React from 'react';

export default function SABLogo({ className = '', size = 40, showText = true }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 400"
      width={size}
      height={(size * 4) / 5}
      className={className}
    >
      <defs>
        {/* Unique ID for the text mask to prevent conflicts if rendered multiple times */}
        <mask id="sab-text-mask-comp">
          <rect x="0" y="0" width="500" height="400" fill="#ffffff" />
          {showText && (
            <text
              x="300"
              y="252"
              fontFamily="'Orbitron', 'Inter', 'Space Mono', sans-serif"
              fontWeight="900"
              fontSize="88"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#000000"
              stroke="#000000"
              strokeWidth="16"
              strokeLinejoin="round"
            >
              SAB
            </text>
          )}
        </mask>
      </defs>

      {/* Background Beaker/Flask Outline (Neon Green) */}
      <path
        d="M 70,340 C 70,340 160,200 180,140 L 180,60 L 250,60 L 250,110 C 250,135 275,150 300,150"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="text-neon-green"
      />
      <path
        d="M 70,340 L 220,340"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        className="text-neon-green"
      />

      {/* Outer Globe Circle (Neon Green) */}
      <circle
        cx="300"
        cy="250"
        r="100"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
        className="text-neon-green"
      />

      {/* Masked Interior Elements (Speed stripes and Globe grids) */}
      <g mask="url(#sab-text-mask-comp)">
        {/* Horizontal Speed Stripes */}
        <line x1="120" y1="222" x2="420" y2="222" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-neon-green" />
        <line x1="105" y1="236" x2="435" y2="236" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-neon-green" />
        <line x1="90" y1="250" x2="450" y2="250" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-neon-green" />
        <line x1="105" y1="264" x2="435" y2="264" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-neon-green" />
        <line x1="120" y1="278" x2="420" y2="278" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-neon-green" />

        {/* Globe Grid: Meridians */}
        <ellipse cx="300" cy="250" rx="50" ry="100" stroke="currentColor" strokeWidth="6" fill="none" className="text-neon-green" />
        <line x1="300" y1="150" x2="300" y2="350" stroke="currentColor" strokeWidth="6" className="text-neon-green" />

        {/* Globe Grid: Latitudes */}
        <path d="M 215,200 Q 300,220 385,200" stroke="currentColor" strokeWidth="6" fill="none" className="text-neon-green" />
        <path d="M 215,300 Q 300,280 385,300" stroke="currentColor" strokeWidth="6" fill="none" className="text-neon-green" />
      </g>

      {/* Foreground Bold Text "SAB" (Accent Pink) */}
      {showText && (
        <text
          x="300"
          y="252"
          fontFamily="'Orbitron', 'Inter', 'Space Mono', sans-serif"
          fontWeight="900"
          fontSize="88"
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          letterSpacing="1"
          className="text-accent-pink"
        >
          SAB
        </text>
      )}
    </svg>
  );
}
