import { FaPlay, FaBookOpen } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";

const UniversalCard = ({ novel, showProgress, showDelete, onRead, onDelete }) => {
    const imageUrl = novel.coverImage?.startsWith("http") 
        ? novel.coverImage 
        : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

    return (
        <div className="group relative w-[165px] md:w-[190px] flex flex-col gap-3 transition-all duration-300">
            
            {/* 1. ART COVER CONTAINER */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/5 shadow-lg ">
                <img 
                    src={imageUrl} 
                    alt={novel.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />

                {/* Glass Delete Button */}
                {showDelete && (
                    <button 
                        onClick={onDelete} 
                        className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-xl bg-black/20 backdrop-blur-md text-white/40 hover:bg-red-500 hover:text-white transition-all border border-white/10"
                    >
                        <IoTrashOutline size={16} />
                    </button>
                )}
            </div>

            {/* 2. TEXT INFO (Clean & Minimal) */}
            <div className="flex flex-col gap-1 px-1">
                <h2 className="line-clamp-1 text-[14px] md:text-[15px] font-bold leading-tight tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                    {novel.title}
                </h2>

                {/* 3. COMPACT ACTION ROW */}
                <button 
                    onClick={onRead}
                    className="mt-2 flex w-full items-center justify-between rounded-xl bg-[var(--bg-secondary)] p-2.5 border border-white/5 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)] group/btn transition-all shadow-lg"
                >
                    <div className="flex items-center gap-2">
                        <FaPlay size={8} className="text-[var(--accent)] group-hover/btn:text-white" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-main)] group-hover/btn:text-white">
                            {showProgress ? "Resume" : "Read"}
                        </span>
                    </div>
                    
                    <span className="text-[12px] font-mono font-bold  group-hover/btn:text-white/80">
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