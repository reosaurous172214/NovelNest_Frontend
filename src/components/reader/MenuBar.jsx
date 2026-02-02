import React, { useState } from "react";
import { Settings, Check, MoveLeft, Type, Palette, Layout, List, Search } from "lucide-react";
import { themeMap, fontMap } from "../../config/readerConfig";

export default function MenuBar({ 
  isVisible, 
  settings, 
  setSettings, 
  chapters = [], 
  onChapterSelect, 
  currentChapterId 
}) {
  const [activeTab, setActiveTab] = useState("archive");
  const [searchQuery, setSearchQuery] = useState("");
  
  const uiBg = "bg-[var(--bg-secondary)]";
  const uiBorder = "border-[var(--border)]";

  const tabs = [
    { id: "archive", icon: <List size={18} />, label: "Index" },
    { id: "text", icon: <Type size={18} />, label: "Font" },
    { id: "layout", icon: <Layout size={18} />, label: "Mode" },
    { id: "theme", icon: <Palette size={18} />, label: "Theme" },
  ];

  const filteredChapters = chapters.filter(ch => 
    ch.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLightSelection = (t) => ['light', 'sepia', 'cream', 'paper'].includes(t.toLowerCase());

  return (
    <>
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 w-full h-16 ${uiBg} backdrop-blur-md text-[var(--text-main)] flex items-center transition-transform duration-500 z-[60] border-b ${uiBorder} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors">
              <MoveLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden xs:block">Exit</span>
          </button>
          <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Console</div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Bottom Console: Responsive Width */}
      <div className={`fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 w-full md:max-w-2xl ${uiBg} border-t md:border-x ${uiBorder} transition-transform duration-500 z-[60] rounded-t-[1.5rem] sm:rounded-t-[2rem] shadow-2xl ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
        
        {/* Responsive Tab Bar */}
        <div className={`flex items-center justify-between border-b ${uiBorder} px-2 sm:px-6`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 py-3 sm:py-4 transition-all ${
                activeTab === tab.id ? "text-[var(--accent)]" : "text-[var(--text-dim)]"
              }`}
            >
              {tab.icon}
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tighter sm:tracking-widest">
                {tab.label}
              </span>
              {activeTab === tab.id && <div className="absolute bottom-0 w-1/4 h-0.5 bg-[var(--accent)] hidden sm:block" />}
            </button>
          ))}
        </div>

        {/* Content Area: Height adjusted for mobile */}
        <div className="p-4 sm:p-6 h-[280px] sm:h-[240px]">
          
          {/* 1. INDEX / ARCHIVE */}
          {activeTab === "archive" && (
            <div className="h-full flex flex-col space-y-3">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                <input 
                  type="text"
                  placeholder="SEARCH MANUSCRIPT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border ${uiBorder} rounded-lg py-2 pl-8 pr-4 text-[9px] font-bold tracking-widest outline-none focus:border-[var(--accent)]"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {filteredChapters.length > 0 ? (
                  filteredChapters.map((ch, i) => (
                    <button
                      key={ch._id || i}
                      onClick={() => onChapterSelect(ch._id)}
                      className={`w-full mb-2 p-3 rounded-lg border text-left transition-all flex items-center justify-between group ${
                        currentChapterId === ch._id 
                        ? "bg-[var(--accent)]/10 border-[var(--accent)]" 
                        : "bg-[var(--bg-primary)] border-transparent hover:border-[var(--border)]"
                      }`}
                    >
                      <div className="truncate">
                        <span className="text-[7px] font-black text-[var(--accent)] uppercase block mb-0.5">Chapter {ch.chapterNumber || i + 1}</span>
                        <span className="text-[11px] font-bold truncate block">{ch.title}</span>
                      </div>
                      {currentChapterId === ch._id && <Check size={12} className="text-[var(--accent)]" />}
                    </button>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center opacity-20 text-[9px] font-black uppercase tracking-widest italic">
                    Index Empty
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. TYPOGRAPHY */}
          {activeTab === "text" && (
            <div className="space-y-6">
              <section className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase opacity-60">
                  <span>Magnification</span>
                  <span className="text-[var(--accent)]">{settings.fontSize}px</span>
                </div>
                <input 
                  type="range" min="14" max="32" 
                  value={settings.fontSize}
                  onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                  className="w-full h-1.5 bg-[var(--bg-primary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)] border ${uiBorder}" 
                />
              </section>
              <section className="space-y-2">
                <p className="text-[9px] font-black uppercase opacity-60">Typography Matrix</p>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {Object.keys(fontMap).map((f) => (
                    <button
                      key={f}
                      onClick={() => setSettings({...settings, font: f})}
                      className={`px-4 py-2 rounded-md text-[10px] font-bold border whitespace-nowrap transition-all ${
                        settings.font === f ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-primary)] text-[var(--text-dim)]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 3. LAYOUT / MODE */}
          {activeTab === "layout" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["single", "infinite"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSettings({...settings, readingMode: mode})}
                  className={`p-6 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    settings.readingMode === mode ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]" : "bg-[var(--bg-primary)] border-transparent"
                  }`}
                >
                  <Layout size={24} className={settings.readingMode === mode ? "opacity-100" : "opacity-20"} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {mode === "single" ? "Paginated" : "Continuous"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* 4. THEME */}
          {activeTab === "theme" && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 overflow-y-auto h-full pr-1">
              {Object.keys(themeMap).map((t) => {
                const bgClass = themeMap[t].split(' ')[0]; 
                const isLight = isLightSelection(t);
                return (
                  <button
                    key={t}
                    onClick={() => setSettings({...settings, theme: t})}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all ${bgClass} ${
                      settings.theme === t ? "border-[var(--accent)] scale-95" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className={`text-[7px] font-black uppercase tracking-tighter mb-1 ${isLight ? "text-black/50" : "text-white/50"}`}>
                      {t}
                    </span>
                    {settings.theme === t && <Check size={14} className={isLight ? "text-black" : "text-white"} />}
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}