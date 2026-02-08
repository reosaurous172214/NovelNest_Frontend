import React from 'react';
import { FaPalette, FaCheckCircle, FaLaptop, FaSun } from 'react-icons/fa';

export default function AdminAppearance({ 
  currentTheme, setTheme, 
  adminTheme, setAdminTheme 
}) {

  const readerThemes = [
    { id: 'default', name: 'Amoled Midnight', color: '#020202', accent: '#38bdf8', text: '#f8fafc', desc: 'True black for OLED screens' },
    { id: 'light', name: 'Soft White', color: '#f8fafc', accent: '#6366f1', text: '#0f172a', desc: 'Clean and professional light mode' },
    { id: 'cream', name: 'Vintage Paper', color: '#fdf6e3', accent: '#b58900', text: '#586e75', desc: 'Easy on the eyes for long reading' },
    { id: 'paperback', name: 'Classic Book', color: '#fffcf5', accent: '#856404', text: '#3c3c3c', desc: 'Mimics real book paper' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#0d0221', accent: '#ff00ff', text: '#00ffff', desc: 'Neon pink and deep purple' },
    { id: 'emerald', name: 'Emerald Forest', color: '#020617', accent: '#10b981', text: '#ecfdf5', desc: 'Dark blue with green accents' },
  ];

  const techThemes = [
    { id: 'admin-tech-dark', name: 'Neon Velocity', color: '#020617', accent: '#38bdf8', text: '#f1f5f9', desc: 'Dark tech with sky-blue glow' },
    { id: 'admin-tech-light-1', name: 'Medical Lab', color: '#f1f5f9', accent: '#6366f1', text: '#0f172a', desc: 'Scientific clean indigo & slate' },
    { id: 'admin-tech-light-2', name: 'Synthetix', color: '#fafafa', accent: '#059669', text: '#171717', desc: 'Modern professional emerald tech' },
  ];

  const ThemeCard = ({ theme, isActive, onSelect }) => (
    <button
      onClick={() => onSelect(theme.id)}
      className={`group relative rounded-xl transition-all duration-300 flex overflow-hidden h-20 border-2`}
      style={{ 
        backgroundColor: theme.color, 
        // Active border uses full accent, inactive uses 20% opacity of the accent
        borderColor: isActive ? theme.accent : `${theme.accent}33`, 
        color: theme.text,
        boxShadow: isActive ? `0 0 15px ${theme.accent}44` : 'none'
      }}
    >
      {/* VERTICAL COLOR PALETTE */}
      <div 
        className="w-2 h-full shrink-0" 
        style={{ backgroundColor: theme.accent }}
      />

      <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-black text-[11px] uppercase tracking-widest italic truncate">
            {theme.name}
          </p>
          {isActive && (
            <FaCheckCircle style={{ color: theme.accent }} className="text-sm shrink-0 ml-2" />
          )}
        </div>
        <p className="opacity-60 text-[9px] mt-1 font-bold uppercase tracking-tight truncate">
          {theme.desc}
        </p>
      </div>

      {/* Glassmorphism Hover Overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );

  return (
    <div className="space-y-10 max-w-6xl p-6">
      <header className="border-b border-white/10 pb-6">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-[var(--text-main)]">
          <FaPalette className="text-[var(--accent)]" /> Appearance
        </h2>
      </header>

      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[var(--text-dim)] flex items-center gap-2">
          <FaSun className="text-yellow-500" /> Reader Themes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {readerThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} isActive={currentTheme === theme.id} onSelect={setTheme} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[var(--text-dim)] flex items-center gap-2">
          <FaLaptop className="text-[var(--accent)]" /> Workspace Themes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} isActive={adminTheme === theme.id} onSelect={setAdminTheme} />
          ))}
        </div>
      </section>
    </div>
  );
}