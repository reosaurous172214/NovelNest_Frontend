import { useState } from "react";
import { Star, BookmarkPlus, BookOpen, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import { getToken } from "../../getItems/getAuthItems"; 
import { useAddBookmark } from "../../hooks/useBookmarks";

export default function NovelCard({ novel }) {
  const [expanded, setExpanded] = useState(false);
  const { showAlert } = useAlert();
  const token = getToken();
  const { addToBookmark, adding } = useAddBookmark();

  const coverUrl = novel.coverImage?.startsWith('http') 
    ? novel.coverImage 
    : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

  const BookMarkHandler = async () => {
    if (!token) {
      showAlert("Please log in to save bookmarks.", "info");
      return;
    }

    try {
      const response = await addToBookmark(novel._id);
      const msg = response?.message || "Saved to your library.";
      showAlert(`"${novel.title}" ${msg}`, "success");
    } catch (err) {
      console.error("Sync Error:", err);
      showAlert("Could not update bookmarks.", "error");
    }
  };

  // UI Tokens
  const glassStyle = "bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl opacity-95 backdrop-blur-3xl";
  const labelFont = "font-sans text-[10px] uppercase tracking-wider font-bold text-[var(--accent)] opacity-80"; 
  const titleFont = "font-sans font-black tracking-tight text-[var(--text-main)] uppercase italic"; 

  return (
    <div className={`relative group overflow-hidden rounded-[2rem] transition-all duration-500 hover:border-[var(--accent)]/40 mb-4 ${glassStyle}`}>
      
      {/* 1. PRIMARY INFO SECTION */}
      <Link to={`/novel/${novel._id}`} className="flex flex-col sm:flex-row items-stretch">
        <div className="relative shrink-0 w-full sm:w-40 h-56 sm:h-auto p-4">
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all duration-700">
            <img
              src={coverUrl}
              alt={novel.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute top-2 left-2">
               <div className="bg-[var(--bg-primary)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                  <p className="font-sans text-[9px] font-bold uppercase text-[var(--accent)]">
                    {novel.status || "Ongoing"}
                  </p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-5 pt-0 sm:pt-5 sm:pr-8 text-left">
          <div className="mb-3">
            <h2 className={`text-xl md:text-2xl ${titleFont} group-hover:text-[var(--accent)] transition-all leading-tight mb-2`}>
              {novel.title}
            </h2>
            <div className="flex items-center gap-3">
               <p className="font-sans text-[10px] text-[var(--text-dim)] font-bold uppercase">
                 By <span className="text-[var(--text-main)] border-b border-[var(--accent)]/30 pb-0.5">{novel.author?.username || "Unknown Author"}</span>
               </p>
               <div className="flex items-center gap-1 bg-[var(--accent)]/10 px-2 py-0.5 rounded-md border border-[var(--accent)]/20">
                  <Star size={10} className="fill-[var(--accent)] text-[var(--accent)]" />
                  <span className="font-sans text-[10px] font-bold text-[var(--accent)]">{novel.rating || "4.8"}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[var(--border)] mb-3 bg-[var(--bg-primary)]/40 rounded-xl px-4">
            <div>
              <p className={labelFont}>Chapters</p>
              <p className="font-sans text-xs font-black text-[var(--text-main)]">{novel.totalChapters}</p>
            </div>
            <div className="border-x border-[var(--border)] px-2">
              <p className={labelFont}>Views</p>
              <p className="font-sans text-xs font-black text-[var(--text-main)]">{novel.views?.toLocaleString()}</p>
            </div>
            <div className="pl-2">
              <p className={labelFont}>Status</p>
              <p className="font-sans text-[10px] font-black text-emerald-500 flex items-center gap-1">
                <Clock size={10} /> Verified
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* 2. DESCRIPTION SECTION */}
      <div className="px-6 pb-6 space-y-4 text-left">
        <div className="flex flex-wrap gap-2">
          {novel.genres?.slice(0, 3).map((g) => (
            <span key={g} className="px-3 py-1 text-[9px] font-bold uppercase bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] rounded-lg hover:text-[var(--accent)] transition-all cursor-default">
              {g}
            </span>
          ))}
        </div>

        <div className="relative p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] group-hover:bg-[var(--bg-secondary)] transition-all">
          <p className={`text-[13px] leading-snug text-[var(--text-dim)] font-medium ${expanded ? "" : "line-clamp-2"}`}>
            {novel.description}
          </p>
          {novel.description?.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-sans text-[10px] font-bold text-[var(--accent)] mt-2 flex items-center gap-1 hover:underline uppercase"
            >
              {expanded ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> Show More</>}
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Link 
            to={`/novel/${novel._id}`}
            className="flex-1 py-3 bg-[var(--accent)] hover:brightness-110 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 text-white shadow-lg active:scale-95"
          >
            <BookOpen size={14} /> Start Reading
          </Link>
          <button 
            disabled={adding}
            onClick={BookMarkHandler} 
            className="sm:w-36 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[11px] font-bold uppercase hover:border-[var(--accent)] transition-all flex items-center justify-center gap-2 text-[var(--text-dim)] hover:text-[var(--text-main)] active:scale-95 disabled:opacity-50"
          >
            <BookmarkPlus size={14} /> {adding ? "Saving..." : "Bookmark"}
          </button>
        </div>
      </div>
    </div>
  );
}