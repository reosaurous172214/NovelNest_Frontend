import React from 'react';

const NovelHubLogo = () => {
  return (
    <svg 
      viewBox="0 0 320 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 md:h-14 w-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
    >
      <defs>
        {/* Frosted Glass Filter */}
        <filter id="glassEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* VIBRANT BLUE TO PURPLE GRADIENT */}
        <linearGradient id="bluePurpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" /> {/* Electric Blue */}
          <stop offset="50%" stopColor="#8B5CF6" /> {/* Vibrant Violet */}
          <stop offset="100%" stopColor="#D946EF" /> {/* Fuchsia/Purple */}
        </linearGradient>

        {/* Glass Background */}
        <linearGradient id="glassFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* 1. Glass Icon Base */}
      <rect 
        x="5" y="10" width="60" height="60" rx="14" 
        fill="url(#glassFill)" 
        stroke="rgba(255,255,255,0.25)" 
        strokeWidth="1.5"
        filter="url(#glassEffect)"
      />

      {/* 2. Modern Book Icon with Blue/Purple Stroke */}
      <path 
        d="M20 25C20 22 24 20 35 20C46 20 50 22 50 25V55C50 58 46 60 35 60C24 60 20 58 20 55V25Z" 
        stroke="url(#bluePurpleGrad)" 
        strokeWidth="4" 
        strokeLinejoin="round"
      />
      <path d="M35 20V60" stroke="url(#bluePurpleGrad)" strokeWidth="2.5" opacity="0.5"/>
      <path d="M28 35L35 30L42 35" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>

      {/* 3. BOLDER TYPOGRAPHY */}
      <text 
        x="75" y="55" 
        fontFamily="Arial Black, Gadget, sans-serif" 
        fontWeight="900" 
        fontSize="42" 
        fill="white"
        letterSpacing="-2"
      >
        Novel<tspan fill="url(#bluePurpleGrad)">Nest</tspan>
      </text>

      {/* 4. Tagline */}
      <text 
        x="78" y="72" 
        fontFamily="Verdana, sans-serif" 
        fontSize="9" 
        fill="rgba(255,255,255,0.4)" 
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