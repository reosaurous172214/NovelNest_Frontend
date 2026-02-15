export default function NotFound() {
  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-[var(--accent)] opacity-20 italic">404</h1>
      <div className="absolute space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-main)]">Error loading page</h2>
        <p className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-[0.5em]">Page not found</p>
        <button onClick={() => window.location.href="/"} className="mt-8 px-8 py-3 bg-[var(--accent)] text-white font-semibold text-[10px] uppercase  rounded-xl shadow-md shadow-[var(--accent-glow)]">
          Return to Home
        </button>
      </div>
    </div>
  );
}