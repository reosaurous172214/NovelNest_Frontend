import React from "react";

const NovelHubLogo = () => {
  return (
    <svg
      viewBox="0 0 340 90"
      xmlns="http://www.w3.org/2000/svg"
      className=" h-12 md:h-16 w-auto transition-all duration-500"
      style={{
        filter: "drop-shadow(0 4px 18px var(--accent-glow))",
        shapeRendering: "geometricPrecision",
        textRendering: "optimizeLegibility"
      }}
    >
      <defs>
        {/* Softer glass blur */}
        <filter id="glassEffect" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        {/* 🔥 FIXED: theme-consistent glass (no currentColor anymore) */}
        <linearGradient id="glassFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--bg-secondary)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--bg-secondary)" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* ===== ICON CONTAINER ===== */}
      <rect
        x="6"
        y="12"
        width="64"
        height="64"
        rx="18"
        fill="url(#glassFill)"
        stroke="var(--border)"
        strokeWidth="1.4"
        filter="url(#glassEffect)"
      />

      {/* ===== BOOK ICON ===== */}
      <path
        d="M24 30C24 26 28 24 38 24C48 24 52 26 52 30V58C52 62 48 64 38 64C28 64 24 62 24 58V30Z"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      <path
        d="M38 24V64"
        stroke="var(--laccent)"
        strokeWidth="4"
        opacity="0.35"
      />

      <path
        d="M31 40L38 34L45 40"
        stroke="var(--logo-main)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* ===== BRAND TEXT ===== */}
      <text
        x="82"
        y="56"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="39"
        fill="var(--text-main)"
        letterSpacing="-1"
      >
        Novel
        <tspan fill="var(--accent)" fontWeight="900">
          Nest
        </tspan>
      </text>

      {/* ===== TAGLINE ===== */}
      <text
        x="84"
        y="74"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="11"
        fill="var(--text-dim)"
        fontWeight="600"
        letterSpacing="1.4"
        style={{ textTransform: "uppercase" }}
      >
        World of Stories
      </text>
    </svg>
  );
};

export default NovelHubLogo;
