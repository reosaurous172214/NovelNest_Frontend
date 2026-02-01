export default function NotFound() {
  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-[var(--accent)] opacity-20 italic">404</h1>
      <div className="absolute space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-main)]">Data Fragment Corrupted</h2>
        <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-[0.5em]">Sector not found in archive</p>
        <button onClick={() => window.location.href="/"} className="mt-8 px-8 py-3 bg-[var(--accent)] text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-[var(--accent-glow)]">
          Return to Terminal
        </button>
      </div>
    </div>
  );
}