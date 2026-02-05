import { FaLock } from "react-icons/fa";

export const AuthPrompt = () => (
    <div className="flex flex-col items-center py-20 text-center">
        <FaLock size={30} className="text-[var(--accent)] mb-6 opacity-30" />
        <h2 className="text-2xl font-black uppercase mb-2">Access Denied</h2>
        <p className="text-[var(--text-dim)] mb-8 text-[10px] font-bold uppercase tracking-widest">Login required to sync collection</p>
        <a href="/login" className="px-10 py-4 rounded-xl bg-[var(--accent)] text-white font-black uppercase text-[10px] tracking-widest">Login</a>
    </div>
);

export const Loading = ({ activeTab }) => (
    <div className="flex flex-col items-center py-20 text-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-black tracking-widest text-[var(--text-dim)] uppercase">Syncing {activeTab}...</span>
    </div>
);

export const Empty = ({ activeTab }) => (
    <div className="py-20 px-6 text-center rounded-[2.5rem] border border-dashed border-[var(--border)] bg-[var(--bg-secondary)]/30 w-full">
        <p className="text-[var(--text-dim)] font-black text-[10px] uppercase tracking-widest mb-8 italic">Your {activeTab} is offline.</p>
        <a href="/novels" className="px-8 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all">Explore Novels</a>
    </div>
);