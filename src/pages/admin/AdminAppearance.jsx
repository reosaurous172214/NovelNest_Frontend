import React from 'react';
import { FaPalette, FaCheckCircle, FaLaptop, FaMoon, FaSun } from 'react-icons/fa';

export default function AdminAppearance({ 
  currentTheme, setTheme, 
  adminTheme, setAdminTheme 
}) {

  // Reader/User Themes
  const readerThemes = [
    { id: 'default', name: 'Amoled Midnight', color: '#020202', desc: 'True black for OLED screens' },
    { id: 'light', name: 'Soft White', color: '#f8fafc', desc: 'Clean and professional light mode' },
    { id: 'cream', name: 'Vintage Paper', color: '#fdf6e3', desc: 'Easy on the eyes for long reading' },
    { id: 'paperback', name: 'Classic Book', color: '#fffcf5', desc: 'Mimics real book paper' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#0d0221', desc: 'Neon pink and deep purple' },
    { id: 'emerald', name: 'Emerald Forest', color: '#020617', desc: 'Dark blue with green accents' },
  ];

  // Admin Specific High-Tech Themes
  const techThemes = [
    { id: 'admin-tech-dark', name: 'Neon Velocity', color: '#050505', desc: 'Dark tech with cyan glow' },
    { id: 'admin-tech-light-1', name: 'Medical Lab', color: '#f1f5f9', desc: 'Scientific clean white & orange' },
    { id: 'admin-tech-light-2', name: 'Synthetix', color: '#f0fdf4', desc: 'Modern mint-green tech' },
  ];

  return (
    <div className="space-y-10 max-w-5xl">
      <header>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaPalette className="text-[var(--accent)]" /> Appearance Settings
        </h2>
        <p className="text-[var(--text-dim)] text-sm">Customize how the platform looks for you and your readers.</p>
      </header>

      {/* SECTION: READER THEMES */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaSun className="text-yellow-500" /> Public Site Themes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {readerThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                currentTheme === theme.id 
                ? "border-[var(--accent)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent)]" 
                : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-dim)]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-8 h-8 rounded-full border border-[var(--border)]" style={{ backgroundColor: theme.color }}></div>
                {currentTheme === theme.id && <FaCheckCircle className="text-[var(--accent)]" />}
              </div>
              <p className="font-bold text-sm">{theme.name}</p>
              <p className="text-[var(--text-dim)] text-xs mt-1">{theme.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <hr className="border-[var(--border)]" />

      {/* SECTION: ADMIN THEMES */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaLaptop className="text-[var(--accent)]" /> Admin Panel Style (High-Tech)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setAdminTheme(theme.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                adminTheme === theme.id 
                ? "border-[var(--accent)] bg-[var(--accent-glow)] ring-1 ring-[var(--accent)]" 
                : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-dim)]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-8 h-8 rounded-full border border-[var(--border)]" style={{ backgroundColor: theme.color }}></div>
                {adminTheme === theme.id && <FaCheckCircle className="text-[var(--accent)]" />}
              </div>
              <p className="font-bold text-sm">{theme.name}</p>
              <p className="text-[var(--text-dim)] text-xs mt-1">{theme.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}