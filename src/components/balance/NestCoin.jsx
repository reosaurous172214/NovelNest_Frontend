import React from 'react';

const NestCoin = ({ size = 100, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Golden Border */}
      <circle cx="100" cy="100" r="95" fill="url(#goldGradient)" stroke="#8A6D3B" strokeWidth="2"/>
      
      {/* Inner Glossy Blue Background */}
      <circle cx="100" cy="100" r="82" fill="url(#blueGloss)" />
      
      {/* Stylish 'N' */}
      <path 
        d="M65 155V45L135 155V45" 
        stroke="white" 
        strokeWidth="18" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.5))' }}
      />
      
      {/* Decorative inner gold ring */}
      <circle cx="100" cy="100" r="85" stroke="#F6D365" strokeWidth="1" opacity="0.5"/>

      <defs>
        {/* Golden Metallic Gradient */}
        <linearGradient id="goldGradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F6D365" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A6D3B" />
        </linearGradient>

        {/* Deep Blue Glossy Gradient */}
        <radialGradient id="blueGloss" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) rotate(90) scale(82)">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default NestCoin;