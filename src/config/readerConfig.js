export const fontMap = {
  // --- SERIF (Best for immersion/novels) ---
  serif: "font-['Source_Serif_4',serif]",
  merriweather: "font-['Merriweather',serif]",
  playfair: "font-['Playfair_Display',serif]",
  lora: "font-['Lora',serif]",

  // --- SANS-SERIF (Clean/Modern) ---
  inter: "font-['Inter',sans-serif]",
  sans: "font-['Helvetica',sans-serif]",
  roboto: "font-['Roboto',sans-serif]",
  work: "font-['Work_Sans',sans-serif]",

  // --- MONO & SPECIAL (For tech/CSE vibes) ---
  mono: "font-['JetBrains_Mono',monospace]",
  fira: "font-['Fira_Code',monospace]",
};
export const themeMap = {
  // --- DAY MODES ---
  light: "bg-[#ffffff] text-neutral-900 border-neutral-200",
  paper: "bg-[#faf9f6] text-[#2c2c2c] border-[#e2e2e2]", // Slight off-white
  sepia: "bg-[#f4ecd8] text-[#5b4636] border-[#e4dcc4]", // Classic book feel
  cream: "bg-[#fffdd0] text-[#3d3d3d] border-[#eee8aa]", // Warm light

  // --- LOW LIGHT MODES ---
  mint: "bg-[#e8f5e9] text-[#1b5e20] border-[#c8e6c9]", // Eye-strain recovery
  rose: "bg-[#fff1f2] text-[#881337] border-[#fecdd3]", // Soft reading

  // --- DARK MODES ---
  dark: "bg-[#0b0c0e] text-neutral-300 border-neutral-800",
  midnight: "bg-[#01050a] text-slate-400 border-slate-900", // High contrast dark
  oled: "bg-[#000000] text-[#d4d4d4] border-neutral-900", // Pure black for battery saving
  nord: "bg-[#2e3440] text-[#eceff4] border-[#3b4252]", // Frosty blue-gray (CSE favorite)
};