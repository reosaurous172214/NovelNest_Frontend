import NestCoin from "./NestCoin.jsx";

export default function WalletDisplay({ size = 20, balance }) {
  // Balanced text scaling
  const textSize = Math.max(size * 0.7, 12); 

  return (
    <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 hover:border-[var(--accent)]/50 transition-all duration-300 w-fit group select-none">
      <div className="flex items-center justify-center group-hover:drop-shadow-[0_0_5px_var(--accent)] transition-all">
        <NestCoin size={size} />
      </div>
      
      <div className="flex items-baseline gap-1">
        <span 
          className="text-[var(--text-main)] font-bold tabular-nums leading-none"
          style={{ fontSize: `${textSize}px` }}
        >
          {balance?.toLocaleString() || 0}
        </span>
        <span className="text-[var(--accent)] text-[9px] font-black uppercase opacity-70">
          Nest
        </span>
      </div>
    </div>
  );
}