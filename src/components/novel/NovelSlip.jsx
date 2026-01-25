import { useState } from "react";
import { Star, Eye, Layers, BookmarkPlus, BookOpen, ChevronDown, ChevronUp, ShieldCheck, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function NovelCard({ novel }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const coverUrl = novel.coverImage?.startsWith('http') 
    ? novel.coverImage 
    : `http://localhost:5000${novel.coverImage}`;

  // Design Tokens: Crystal Clear + Formal Dossier
  const glassStyle = "bg-white/[0.02] backdrop-blur-[30px] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]";
  const labelFont = "font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-400"; // Technical labels
  const titleFont = "font-sans font-black tracking-tight text-white uppercase"; // Formal headers
  const bodyFont = "font-serif leading-relaxed text-gray-400"; // Narrative text

  return (
    <div className={`relative group overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-indigo-500/10 mb-6 ${glassStyle}`}>
      
      {/* 1. PRIMARY INFO SECTION */}
      <Link to={`/novel/${novel._id}`} className="flex flex-col sm:flex-row items-stretch">
        
        {/* COVER: Left/Top Evidence Photo */}
        <div className="relative shrink-0 w-full sm:w-40 h-56 sm:h-auto p-4">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 group-hover:border-indigo-500/40 transition-all duration-500">
            <img
              src={coverUrl}
              alt={novel.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dynamic Status Badge */}
            <div className="absolute top-3 left-3">
               <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                  <p className="font-sans text-[8px] font-black uppercase tracking-widest text-indigo-300">
                    {novel.status || "Ongoing"}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* REGISTRY: Core Metadata */}
        <div className="flex-1 flex flex-col justify-center p-5 pt-0 sm:pt-5 sm:pr-8">
          <div className="mb-4">
            <h2 className={`text-xl md:text-2xl ${titleFont} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-400 transition-all`}>
              {novel.title}
            </h2>
            <div className="flex items-center gap-3 mt-2">
               <p className="font-sans text-[10px] text-gray-500 font-medium">
                 AUTHORED BY <span className="text-gray-300 border-b border-indigo-500/30">{novel.author?.username || "Unknown"}</span>
               </p>
               <div className="flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  <Star size={10} className="fill-indigo-500 text-indigo-500" />
                  <span className="font-sans text-[10px] font-black text-indigo-400">{novel.rating || "4.5"}</span>
               </div>
            </div>
          </div>

          {/* STATS GRID: Compact Technical Data */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 mb-4 bg-white/[0.01] rounded-xl px-3">
            <div>
              <p className={labelFont}>Volume</p>
              <p className="font-sans text-xs font-bold text-gray-200">{novel.totalChapters} CH</p>
            </div>
            <div className="border-x border-white/10 px-2 text-center sm:text-left">
              <p className={labelFont}>Traffic</p>
              <p className="font-sans text-xs font-bold text-gray-200">{novel.views?.toLocaleString()}</p>
            </div>
            <div className="pl-2 text-right sm:text-left">
              <p className={labelFont}>Registry</p>
              <p className="font-sans text-[10px] font-bold text-green-400 flex items-center justify-end sm:justify-start gap-1">
                <Clock size={10} /> VERIFIED
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* 2. DOSSIER DETAILS SECTION */}
      <div className="px-6 pb-6 space-y-4">
        
        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          {novel.genres.slice(0, 3).map((g) => (
            <span key={g} className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-indigo-200 rounded-full hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-default">
              {g}
            </span>
          ))}
        </div>

        {/* SYNOPSIS BOX */}
        <div className="relative p-4 rounded-2xl bg-black/20 border border-white/[0.03] group-hover:bg-black/30 transition-all">
          <p className={`${bodyFont} text-[13px] ${expanded ? "" : "line-clamp-2"}`}>
            {novel.description}
          </p>
          {novel.description?.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-sans text-[9px] font-black text-indigo-400 mt-3 flex items-center gap-1 hover:underline tracking-[0.2em]"
            >
              {expanded ? <><ChevronUp size={12} /> COLLAPSE DOSSIER</> : <><ChevronDown size={12} /> READ FULL SYNOPSIS</>}
            </button>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link 
            to={`/novel/${novel._id}`}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-2 text-white shadow-lg shadow-indigo-900/40"
          >
            <BookOpen size={14} /> INITIALIZE READING
          </Link>
          <button className="sm:w-32 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-white">
            <BookmarkPlus size={14} /> SAVE
          </button>
        </div>
      </div>
    </div>
  );
}