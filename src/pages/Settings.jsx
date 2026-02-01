import { useState } from "react";
import { FaPalette, FaShieldAlt, FaCheckCircle, FaLaptopCode, FaMoon, FaLeaf, FaSun, FaBookOpen } from "react-icons/fa";

// Updated THEMES with specific DNA colors for previewing
const THEMES = [
  { 
    id: 'default', 
    label: 'Amoled Black', 
    icon: <FaMoon />, 
    desc: 'Maximum contrast for night reading.', 
    color: '#000000', 
    text: '#ffffff' 
  },
  { 
    id: 'light', 
    label: 'Pure Light', 
    icon: <FaSun />, 
    desc: 'High-visibility archive uplink.', 
    color: '#ffffff', 
    text: '#1a1a1a' 
  },
  { 
    id: 'cream', 
    label: 'Vintage Paper', 
    icon: <FaBookOpen />, 
    desc: 'Soft sepia tones for long focus.', 
    color: '#f4ecd8', 
    text: '#5b4636' 
  },
  { 
    id: 'cyberpunk', 
    label: 'Cyber Neon', 
    icon: <FaLaptopCode />, 
    desc: 'High-energy neon aesthetic.', 
    color: '#0f0524', 
    text: '#00fff2' 
  },
  { 
    id: 'emerald', 
    label: 'Forest Green', 
    icon: <FaLeaf />, 
    desc: 'Organic tones for late-night reading.', 
    color: '#062016', 
    text: '#d1fae5' 
  },
];

export default function Settings({ currentTheme = "default", setTheme }) {
  const [activeSection, setActiveSection] = useState("interface");

  const glassStyle = "bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl transition-all duration-500";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-32 pb-20 px-6 transition-colors duration-500 text-left">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-full lg:w-72 space-y-4">
          <div className="px-4 mb-8">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">System</h1>
            <p className="text-[10px] font-mono text-[var(--accent)] uppercase tracking-[0.3em] mt-2">Config Console</p>
          </div>
          
          <nav className="space-y-2">
            <SettingsTab 
              icon={<FaPalette />} label="Visuals" active={activeSection === "interface"} 
              onClick={() => setActiveSection("interface")} 
            />
            <SettingsTab 
              icon={<FaShieldAlt />} label="Security" active={activeSection === "security"} 
              onClick={() => setActiveSection("security")} 
            />
          </nav>
        </aside>

        {/* --- MAIN PANEL --- */}
        <main className="flex-1">
          <div className={`${glassStyle} p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-700`}>
            
            {activeSection === "interface" && (
              <div className="space-y-10">
                <section>
                  <h2 className="text-xl font-black uppercase italic tracking-tight mb-8 flex items-center gap-4">
                    <div className="w-1 h-6 bg-[var(--accent)]"></div> Visual DNA
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        // Cards use their own theme background, only border changes based on global currentTheme
                        style={{ backgroundColor: t.color }}
                        className={`p-6 rounded-[2.5rem] border-2 transition-all text-left relative group overflow-hidden ${
                          currentTheme === t.id 
                          ? "border-[var(--accent)] shadow-lg shadow-[var(--accent-glow)] scale-[1.02]" 
                          : "border-[var(--border)] hover:border-[var(--accent)]/40"
                        }`}
                      >
                        {/* Content inside card uses specific theme text color */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div style={{ color: t.text }} className="text-xl opacity-80 group-hover:opacity-100 transition-opacity">
                            {t.icon}
                          </div>
                          {currentTheme === t.id && (
                            <FaCheckCircle className="text-[var(--accent)] drop-shadow-[0_0_8px_var(--accent-glow)]" />
                          )}
                        </div>

                        <h4 style={{ color: t.text }} className="font-black text-[11px] uppercase tracking-widest mb-1 relative z-10">
                          {t.label}
                        </h4>
                        <p style={{ color: t.text }} className="text-[10px] opacity-60 leading-relaxed relative z-10">
                          {t.desc}
                        </p>

                        {/* Subtle glass overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="pt-10 border-t border-[var(--border)] flex flex-col md:flex-row items-center gap-8">
                   <div className="w-20 h-20 rounded-3xl bg-[var(--accent)] shadow-2xl shadow-[var(--accent-glow)] animate-pulse flex items-center justify-center">
                      <FaCheckCircle className="text-white text-2xl" />
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-2">Protocol Active</h4>
                      <p className="text-xs text-[var(--text-dim)] leading-relaxed max-w-md">
                        Your interface is currently rendering the <span className="text-[var(--text-main)] font-bold">{(currentTheme || 'default').toUpperCase()}</span> environment. This changes all backgrounds, text contrast, and glow signatures site-wide.
                      </p>
                   </div>
                </section>
              </div>
            )}

            {activeSection === "security" && (
              <div className="py-20 text-center opacity-30">
                <FaShieldAlt size={48} className="mx-auto mb-6 text-[var(--accent)]" />
                <p className="font-mono text-xs uppercase tracking-[0.4em]">Encryption Modules Stable</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const SettingsTab = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 border ${
      active 
      ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-xl shadow-[var(--accent-glow)] scale-[1.02]" 
      : "bg-[var(--bg-secondary)] text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--accent)]/30"
    }`}
  >
    <span className={active ? "text-white" : "text-[var(--accent)]"}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);