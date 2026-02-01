import React from "react";

/**
 * ReaderContent: The primary container for the manuscript text.
 * Refactored to support dynamic themes and optimal readability.
 */
export const ReaderContent = ({ children }) => {
  return (
    <div className="w-full min-h-screen transition-colors duration-500">
      <div 
        className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-1000"
        style={{
          color: "var(--text-main)",
          // Ensuring the selection color matches your theme accent
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* The manuscript body */}
        <div className="relative z-10 selection:bg-[var(--accent)] selection:text-white">
          {children}
        </div>

        {/* Bottom decorative element to signal end of content */}
        <div className="mt-20 flex justify-center opacity-10">
          <div className="w-12 h-1 bg-[var(--text-dim)] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};