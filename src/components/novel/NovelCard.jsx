import { Link } from "react-router-dom";
import { FaStar, FaBookmark } from "react-icons/fa";

const NovelCard = ({ novel, loading = false }) => {
  if (loading) {
    return (
      <div className="w-[190px] sm:w-[210px] animate-pulse">
        <div className="aspect-[2/3] bg-[var(--bg-secondary)] rounded-[2rem] border border-[var(--border)] mb-3" />
        <div className="h-4 bg-[var(--bg-secondary)] rounded-md w-3/4 mb-2" />
        <div className="h-3 bg-[var(--bg-secondary)] rounded-md w-1/2 opacity-50" />
      </div>
    );
  }

  const coverUrl = novel.coverImage?.startsWith('http') 
    ? novel.coverImage 
    : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

  return (
    <Link
      to={`/novel/${novel._id}`}
      className="group relative flex flex-col w-[190px] sm:w-[210px] perspective-1000"
    >
      {/* 1. Dynamic Background Glow (Inherits Theme Accent) */}
      <div className="absolute -inset-2 bg-[var(--accent)] opacity-0 group-hover:opacity-20 rounded-[2.5rem] blur-2xl transition-opacity duration-700 pointer-events-none" />

      {/* 2. Main Glass Shell */}
      <div className="relative flex flex-col h-full rounded-[2rem] bg-[var(--bg-secondary)] opacity-95 backdrop-blur-xl border border-[var(--border)] overflow-hidden transition-all duration-500 group-hover:border-[var(--accent)]/50 group-hover:-translate-y-3 group-hover:rotate-[1deg] shadow-2xl">
        
        {/* 3. Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden m-2 rounded-[1.5rem] bg-[var(--bg-primary)]">
          <img
            src={coverUrl}
            alt={novel.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Glass Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <div className="bg-[var(--bg-secondary)] opacity-80 backdrop-blur-xl px-2 py-1 rounded-lg border border-[var(--border)] flex items-center gap-1 shadow-2xl">
              <FaStar className="text-yellow-400 text-[8px]" />
              <span className="text-[10px] font-black text-[var(--text-main)]">{novel.rating || "4.8"}</span>
            </div>
          </div>

          <button className="absolute top-2 right-2 p-2 rounded-lg bg-[var(--bg-primary)] opacity-80 backdrop-blur-md border border-[var(--border)] text-[var(--text-main)] opacity-0 group-hover:opacity-100 transition-all hover:text-[var(--accent)]">
            <FaBookmark size={10} />
          </button>

          {/* Genre Chip (Dynamic Accent) */}
          <div className="absolute bottom-2 left-2">
             <span className="bg-[var(--accent)] px-3 py-1 rounded-full text-[8px] font-black tracking-widest text-white uppercase shadow-lg shadow-[var(--accent-glow)]">
                {novel.genres?.[0] || "Archive"}
             </span>
          </div>
        </div>

        {/* 4. Typography Section */}
        <div className="px-4 pb-4 pt-2 flex flex-col flex-grow text-left">
          <h3 className="text-sm font-black text-[var(--text-main)] leading-tight mb-1 group-hover:text-[var(--accent)] transition-all uppercase tracking-tighter italic">
            {novel.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-auto">
            <div className="w-4 h-4 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] shrink-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-40" />
            </div>
            <p className="text-[9px] text-[var(--text-dim)] font-bold truncate uppercase tracking-tighter">
              {novel.author?.username || (typeof novel.author === 'string' ? novel.author : "Authorized Entity")}
            </p>
          </div>

          {/* 5. Progress Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-[var(--text-dim)] uppercase tracking-widest">Chapters</span>
                <span className="text-[10px] font-bold text-[var(--text-main)]">{novel.totalChapters ?? "0"}</span>
             </div>
             <div className="text-right flex flex-col">
                <span className="text-[7px] font-black text-[var(--text-dim)] uppercase tracking-widest">Status</span>
                <span className="text-[9px] font-black text-[var(--accent)] uppercase italic tracking-tighter">{novel.status || "Uplinked"}</span>
             </div>
          </div>
        </div>
      </div>

      {/* 6. Ground Shadow */}
      <div className="w-[80%] h-4 bg-black opacity-40 blur-xl mx-auto rounded-full transition-all duration-500 group-hover:scale-110" />
    </Link>
  );
};

export default NovelCard;