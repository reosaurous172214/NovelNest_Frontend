import { LuPlay, LuTrash2, LuBookOpen } from "react-icons/lu";

const UniversalCard = ({ novel, showProgress, showDelete, onRead, onDelete }) => {
    const imageUrl = novel.coverImage?.startsWith("http") 
        ? novel.coverImage 
        : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

    return (
        <div className="group relative w-[165px] md:w-[190px] flex flex-col gap-3 transition-all duration-300 font-sans antialiased">
            
            {/* 1. ART COVER CONTAINER */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-[var(--border)] shadow-md bg-[var(--bg-secondary)]">
                <img 
                    src={imageUrl} 
                    alt={novel.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                />

                {/* Glass Delete Button */}
                {showDelete && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }} 
                        className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md text-white/60 hover:bg-red-500 hover:text-white transition-all border border-white/10"
                    >
                        <LuTrash2 size={16} />
                    </button>
                )}
            </div>

            {/* 2. TEXT INFO */}
            <div className="flex flex-col gap-1 px-1 text-left">
                <h2 className="line-clamp-1 text-[14px] md:text-[15px] font-semibold leading-tight tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                    {novel.title}
                </h2>

                {/* 3. ACTION ROW */}
                <button 
                    onClick={onRead}
                    className="mt-1 flex w-full items-center justify-between rounded-xl bg-[var(--bg-secondary)] p-2.5 border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)] group/btn transition-all shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <LuPlay size={10} className="text-[var(--accent)] group-hover/btn:text-white transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)] group-hover/btn:text-white transition-colors">
                            {showProgress ? "Resume" : "Read"}
                        </span>
                    </div>
                    
                    <span className="text-[10px] font-medium text-[var(--text-dim)] group-hover/btn:text-white/80 transition-colors uppercase tracking-tighter">
                        {showProgress 
                            ? `CH.${novel.lastReadChapter || 1}` 
                            : (novel.updatedAt ? new Date(novel.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'NEW')
                        }
                    </span>
                </button>
            </div>
        </div>
    );
};

export default UniversalCard;