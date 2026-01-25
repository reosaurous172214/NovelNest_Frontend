import { Link } from "react-router-dom";
import { FaStar, FaBookmark } from "react-icons/fa";

const NovelCard = ({ novel, loading = false }) => {
  if (loading) {
    return (
      <div className="w-[190px] sm:w-[210px] animate-pulse">
        <div className="aspect-[2/3] bg-white/5 rounded-[2rem] border border-white/10 mb-3" />
        <div className="h-4 bg-white/10 rounded-md w-3/4 mb-2" />
        <div className="h-3 bg-white/5 rounded-md w-1/2" />
      </div>
    );
  }

  const coverUrl = novel.coverImage?.startsWith('http') 
    ? novel.coverImage 
    : `http://localhost:5000${novel.coverImage}`;

  return (
    <Link
      to={`/novel/${novel._id}`}
      className="group relative flex flex-col w-[190px] sm:w-[210px] perspective-1000"
    >
      {/* 1. Dynamic Background Glow (Active on Hover) */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/30 via-purple-500/30 to-fuchsia-500/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* 2. Main Glass Shell */}
      <div className="relative flex flex-col h-full rounded-[2rem] bg-white/[0.01] backdrop-blur-xl border border-white/[0.08] overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:-translate-y-3 group-hover:rotate-[1deg] shadow-2xl">
        
        {/* 3. Image Container with "Float" effect */}
        <div className="relative aspect-[2/3] overflow-hidden m-2 rounded-[1.5rem]">
          <img
            src={coverUrl}
            alt={novel.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Glass Overlay Badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <div className="bg-white/10 backdrop-blur-xl px-2 py-1 rounded-lg border border-white/20 flex items-center gap-1 shadow-2xl">
              <FaStar className="text-yellow-400 text-[8px]" />
              <span className="text-[10px] font-black text-white">{novel.rating || "4.8"}</span>
            </div>
          </div>

          <button className="absolute top-2 right-2 p-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600">
            <FaBookmark size={10} />
          </button>

          {/* Genre Chip (Layered) */}
          <div className="absolute bottom-2 left-2">
             <span className="bg-blue-600 px-3 py-1 rounded-full text-[8px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/40">
                {novel.genres?.[0] || "Fiction"}
             </span>
          </div>
        </div>

        {/* 4. Glass Typography Section */}
        <div className="px-4 pb-4 pt-2 flex flex-col flex-grow">
          <h3 className="text-sm font-black text-white leading-tight mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
            {novel.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-auto">
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/10 shrink-0" />
            <p className="text-[9px] text-gray-500 font-bold truncate uppercase tracking-tighter">
              {novel.author?.username || "Unknown"}
            </p>
          </div>

          {/* 5. Progress Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Chapters</span>
                <span className="text-[10px] font-bold text-gray-300">{novel.totalChapters ?? "0"}</span>
             </div>
             <div className="text-right flex flex-col">
                <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Status</span>
                <span className="text-[9px] font-black text-blue-400 uppercase italic">{novel.status || "Live"}</span>
             </div>
          </div>
        </div>
      </div>

      {/* 6. Realistic Shadow "Reflection" */}
      <div className="w-[80%] h-4 bg-black/40 blur-xl mx-auto rounded-full transition-all duration-500 group-hover:scale-110 opacity-50" />
    </Link>
  );
};

export default NovelCard;