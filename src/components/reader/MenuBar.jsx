import React from "react";
import { Settings, Check, MoveLeft } from "lucide-react";
import { themeMap, fontMap } from "../../config/readerConfig";

// FIX: Added { isVisible, settings, setSettings } as props in the function arguments
export default function MenuBar({ isVisible, settings, setSettings }) {
  const uiBg = "bg-[var(--bg-secondary)]";
  const uiBorder = "border-[var(--border)]";

  return (
    <>
      {/* Top Bar: Navigation */}
      <div className={`fixed top-0 left-0 w-full h-16 ${uiBg} opacity-95 backdrop-blur-md text-[var(--text-main)] flex items-center transition-transform duration-500 z-50 border-b ${uiBorder} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-6">
          <button 
            onClick={() => window.history.back()} 
            className="group flex items-center gap-3 transition-all active:scale-95"
          >
            <div className="p-2 rounded-xl border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all">
              <MoveLeft className="text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors" size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors hidden sm:block">
              Exit Archive
            </span>
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.4em] uppercase opacity-40 italic">
            Reader Console
          </h2>
        </div>
      </div>

      {/* Bottom Bar: Settings */}
      <div className={`fixed bottom-0 left-0 w-full ${uiBg} opacity-98 backdrop-blur-2xl text-[var(--text-main)] p-8 border-t ${uiBorder} transition-transform duration-500 z-50 max-h-[70vh] overflow-y-auto rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
        <div className="max-w-xl mx-auto space-y-10">
          
          {/* 1. Magnification */}
          <section className="space-y-4">
            <div className="flex justify-between text-[10px] text-[var(--text-dim)] uppercase tracking-[0.3em] font-black">
              <span>Magnification</span>
              <span className="text-[var(--accent)]">{settings.fontSize}px</span>
            </div>
            <div className="flex items-center gap-6 bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border)]">
              <span className="text-sm opacity-30 font-serif">A</span>
              <input 
                type="range" 
                min="14" max="32" 
                value={settings.fontSize}
                onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                className="flex-1 h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]" 
              />
              <span className="text-2xl font-serif">A</span>
            </div>
          </section>

          {/* 2. Reading Mode Toggle (The Infinite Logic) */}
          <section className="space-y-4 text-left pt-6 border-t border-[var(--border)]">
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.3em] font-black ml-1">Logic Pattern</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSettings({...settings, readingMode: "single"})}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                  settings.readingMode === "single" 
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" 
                  : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-dim)]"
                }`}
              >
                Single Page
              </button>
              <button
                onClick={() => setSettings({...settings, readingMode: "infinite"})}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                  settings.readingMode === "infinite" 
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" 
                  : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-dim)]"
                }`}
              >
                Infinite Scroll
              </button>
            </div>
          </section>

          {/* 3. Typography */}
          <section className="space-y-4 text-left">
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.3em] font-black ml-1">Typography Matrix</p>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {Object.keys(fontMap).map((f) => (
                <button
                  key={f}
                  onClick={() => setSettings({...settings, font: f})}
                  className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    settings.font === f 
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" 
                    : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>

          {/* 4. Visual Themes */}
          <section className="space-y-4 text-left">
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.3em] font-black ml-1">Visual Spectrum</p>
            <div className="grid grid-cols-5 md:grid-cols-8 gap-4">
              {Object.keys(themeMap).map((t) => {
                const bgClass = themeMap[t].split(' ')[0]; 
                return (
                  <button
                    key={t}
                    onClick={() => setSettings({...settings, theme: t})}
                    className={`group relative w-full aspect-square rounded-2xl border-2 flex items-center justify-center transition-all active:scale-90 shadow-md ${bgClass} ${
                      settings.theme === t ? "border-[var(--accent)] ring-4 ring-[var(--accent)]/20" : "border-transparent"
                    }`}
                  >
                    {settings.theme === t && (
                      <Check size={18} className={t === 'light' || t === 'sepia' || t === 'cream' ? "text-black" : "text-white"} />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
// FIX: No need for a separate export default line if you use 'export default function' at the top.