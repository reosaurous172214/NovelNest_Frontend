const LoadingSpinner = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] px-4">
        {/* The Outer Ring */}
        <div className="relative w-12 h-12 md:w-16 md:h-16">
            <div className="absolute inset-0 border-4 border-[var(--accent)]/20 rounded-full"></div>
            {/* The Spinning Arc */}
            <div className="absolute inset-0 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Futuristic Status Text */}
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] animate-pulse">
            Establishing Link...
        </p>
    </div>
);

export default LoadingSpinner;