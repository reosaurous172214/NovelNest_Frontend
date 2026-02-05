import React from 'react';

const NovelHubLogo = () => {
  return (
    <svg 
      viewBox="0 0 320 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 md:h-14 w-auto transition-all duration-500"
      style={{
        // Uses the dynamic glow variable from your CSS
        filter: `drop-shadow(0 0 12px var(--accent-glow))`
      }}
    >
      <defs>
        {/* Frosted Glass Filter */}
        <filter id="glassEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Glass Background - Adapts to current theme background */}
        <linearGradient id="glassFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* 1. Glass Icon Base - Dimensions unchanged, border color is dynamic */}
      <rect 
        x="5" y="10" width="60" height="60" rx="14" 
        fill="url(#glassFill)" 
        stroke="var(--border)" 
        strokeWidth="1.5"
        filter="url(#glassEffect)"
      />

      {/* 2. Book Icon - Now uses the theme's ACCENT color */}
      <path 
        d="M20 25C20 22 24 20 35 20C46 20 50 22 50 25V55C50 58 46 60 35 60C24 60 20 58 20 55V25Z" 
        stroke="var(--accent)" 
        strokeWidth="4" 
        strokeLinejoin="round"
      />
      <path d="M35 20V60" stroke="var(--accent)" strokeWidth="2.5" opacity="0.4"/>
      <path d="M28 35L35 30L42 35" stroke="var(--text-main)" strokeWidth="2.5" strokeLinecap="round"/>

      {/* 3. TYPOGRAPHY - NOVEL stays main color, NEST takes the accent color */}
      <text 
        x="75" y="55" 
        fontFamily="Arial Black, Gadget, sans-serif" 
        fontWeight="900" 
        fontSize="42" 
        fill="var(--text-main)"
        letterSpacing="-2"
      >
        Nest<tspan fill="var(--accent)">Admin</tspan>
      </text>

      {/* 4. Tagline - Uses the dimmed text variable for better hierarchy */}
      <text 
        x="78" y="72" 
        fontFamily="Verdana, sans-serif" 
        fontSize="9" 
        fill="var(--text-dim)" 
        fontWeight="bold"
        letterSpacing="2.8"
        style={{ textTransform: 'uppercase' }}
      >
        World of Stories
      </text>
    </svg>
  );
};

export default NovelHubLogo;