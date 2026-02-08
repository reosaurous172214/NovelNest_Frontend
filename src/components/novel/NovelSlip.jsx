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

  // UI Tokens - Shortened fonts and removed radius
  const glassStyle = "bg-[var(--bg-secondary)] border border-[var(--border)] shadow-md opacity-95 backdrop-blur-3xl rounded-none";
  const labelFont = "font-sans text-[8px] uppercase tracking-wider font-bold text-[var(--accent)] opacity-80"; 
  const titleFont = "font-sans font-black tracking-tight text-[var(--text-main)] uppercase italic"; 

  return (
    <div className={`relative group overflow-hidden transition-all duration-500 hover:border-[var(--accent)]/40 mb-2 max-w-4xl mx-auto ${glassStyle}`}>
      
      {/* 1. PRIMARY INFO SECTION - Shortened heights and widths */}
      <Link to={`/novel/${novel._id}`} className="flex flex-row items-stretch">
        <div className="relative shrink-0 w-24 sm:w-32 h-36 sm:h-44 p-2">
          <div className="relative h-full w-full overflow-hidden rounded-none border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all duration-700">
            <img
              src={coverUrl}
              alt={novel.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute top-1 left-1">
               <div className="bg-[var(--bg-primary)] px-1.5 py-0.5 rounded-none border border-[var(--border)]">
                  <p className="font-sans text-[7px] font-bold uppercase text-[var(--accent)]">
                    {novel.status || "Ongoing"}
                  </p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-3 sm:pr-6 text-left">
          <div className="mb-2">
            <h2 className={`text-sm sm:text-lg ${titleFont} group-hover:text-[var(--accent)] transition-all leading-tight mb-1`}>
              {novel.title}
            </h2>
            <div className="flex items-center gap-2">
               <p className="font-sans text-[9px] text-[var(--text-dim)] font-bold uppercase">
                 By <span className="text-[var(--text-main)] border-b border-[var(--accent)]/30">{novel.author?.username || "Anonymous"}</span>
               </p>
               <div className="flex items-center gap-1 bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-none border border-[var(--accent)]/20">
                  <Star size={8} className="fill-[var(--accent)] text-[var(--accent)]" />
                  <span className="font-sans text-[9px] font-bold text-[var(--accent)]">{novel.rating || "4.8"}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 py-2 border-y border-[var(--border)] mb-2 bg-[var(--bg-primary)]/40 rounded-none px-3">
            <div>
              <p className={labelFont}>Chapters</p>
              <p className="font-sans text-[10px] font-black text-[var(--text-main)]">{novel.totalChapters}</p>
            </div>
            <div className="border-x border-[var(--border)] px-1">
              <p className={labelFont}>Views</p>
              <p className="font-sans text-[10px] font-black text-[var(--text-main)]">{novel.views > 999 ? (novel.views/1000).toFixed(1)+'k' : novel.views}</p>
            </div>
            <div className="pl-1">
              <p className={labelFont}>Status</p>
              <p className="font-sans text-[8px] font-black text-emerald-500 flex items-center gap-1">
                <Clock size={8} /> Verified
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* 2. DESCRIPTION SECTION - Compacted padding and spacing */}
      <div className="px-4 pb-4 space-y-3 text-left">
        <div className="flex flex-wrap gap-1">
          {novel.genres?.slice(0, 3).map((g) => (
            <span key={g} className="px-2 py-0.5 text-[8px] font-bold uppercase bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] rounded-none hover:text-[var(--accent)] transition-all cursor-default">
              {g}
            </span>
          ))}
        </div>

        <div className="relative p-3 rounded-none bg-[var(--bg-primary)] border border-[var(--border)] group-hover:bg-[var(--bg-secondary)] transition-all">
          <p className={`text-[11px] leading-tight text-[var(--text-dim)] font-medium ${expanded ? "" : "line-clamp-1"}`}>
            {novel.description}
          </p>
          {novel.description?.length > 80 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-sans text-[8px] font-bold text-[var(--accent)] mt-1 flex items-center gap-1 hover:underline uppercase"
            >
              {expanded ? <><ChevronUp size={10} /> Less</> : <><ChevronDown size={10} /> More</>}
            </button>
          )}
        </div>

        <div className="flex flex-row gap-2 pt-1">
          <Link 
            to={`/novel/${novel._id}`}
            className="flex-1 py-2 bg-[var(--accent)] hover:brightness-110 rounded-none text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-2 text-white shadow-md active:scale-95"
          >
            <BookOpen size={12} /> Read
          </Link>
          <button 
            disabled={adding}
            onClick={BookMarkHandler} 
            className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-none text-[9px] font-bold uppercase hover:border-[var(--accent)] transition-all flex items-center justify-center gap-2 text-[var(--text-dim)] hover:text-[var(--text-main)] active:scale-95 disabled:opacity-50"
          >
            <BookmarkPlus size={12} /> {adding ? "..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}