import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, Search } from "lucide-react";

const RecommendedNovels = ({ novelId }) => {
  const [recommendedNovels, setRecommendedNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchRecommendedNovels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/novels/recommended/${novelId}`
      );
      
      // FIX: The backend now returns the array directly [ {}, {}, ... ]
      // instead of { novels: [] }.
      setRecommendedNovels(res.data || []); 
      
    } catch (err) {
      console.error("Dossier retrieval failed", err);
      setError("Recommendation engine failure.");
    } finally {
      setLoading(false);
    }
  };

  if (novelId) fetchRecommendedNovels();
}, [novelId]);

  // Updated Typography Tokens
  const monoFont = "font-['JetBrains_Mono'] tracking-[0.3em] uppercase text-[8px] antialiased";
  const bodyFont = "font-['Inter'] antialiased";
  const glassEffect = "bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 hover:border-indigo-500/40 shadow-2xl transition-all duration-500";

  if (loading) {
    return (
      <div className="flex flex-col items-center py-24 space-y-6 opacity-40">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className={`${monoFont} text-gray-400`}>Searching archive for related data...</p>
      </div>
    );
  }

  if (error || !recommendedNovels.length) return null;

  return (
    <section className={` pt-10 ${bodyFont}`}>
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 flex items-center justify-center bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <Search size={20} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-[900] text-white uppercase italic tracking-tighter leading-none">
              Similar <span className="text-indigo-500">Novels</span>
            </h2>
            <p className={`${monoFont} text-gray-600 mt-2`}>Best Novels Match</p>
          </div>
        </div>
        <div className="h-px flex-1 mx-12 bg-gradient-to-r from-white/5 to-transparent hidden md:block" />
      </div>

      {/* NOVEL GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {recommendedNovels.slice(0,6).map((novel) => {
          const coverUrl = novel.coverImage?.startsWith('http') 
            ? novel.coverImage 
            : `http://localhost:5000${novel.coverImage}`;

          return (
            <Link
              key={novel._id}
              to={`/novel/${novel._id}`}
              className={`group relative flex flex-col h-full rounded-2xl overflow-hidden ${glassEffect}`}
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={coverUrl || "https://api.dicebear.com/7.x/shapes/svg?seed=Arch"}
                  alt={novel.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                
                {/* FLOATING RATING */}
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-xl">
                  <Star size={10} className="fill-indigo-500 text-indigo-500" />
                  <span className="font-['JetBrains_Mono'] text-[9px] font-black text-white">{novel.rating || "4.8"}</span>
                </div>
              </div>

              {/* METADATA */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[12px] font-black text-gray-200 uppercase tracking-tight leading-snug line-clamp-2 group-hover:text-indigo-400 transition-colors mb-4">
                  {novel.title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={11} className="text-indigo-500/60" />
                    <span className={`${monoFont} text-gray-700`}>
                      Ch : {novel.totalChapters || 0}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendedNovels;