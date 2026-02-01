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
          `${process.env.REACT_APP_API_URL}/api/novels/recommended/${novelId}`
        );
        // Data mapping to handle direct array response
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

  // Dynamic Theme Tokens
  const monoFont = "font-mono tracking-[0.3em] uppercase text-[8px] antialiased";
  const glassEffect = "bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/40 shadow-2xl transition-all duration-500";

  if (loading) {
    return (
      <div className="flex flex-col items-center py-24 space-y-6 opacity-40">
        <div className="w-10 h-10 border-2 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
        <p className={`${monoFont} text-[var(--text-dim)]`}>Scanning archive for related data nodes...</p>
      </div>
    );
  }

  if (error || !recommendedNovels.length) return null;

  return (
    <section className="pt-20 text-left">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-14 h-14 flex items-center justify-center bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-2xl text-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]">
            <Search size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl md:text-4xl font-black text-[var(--text-main)] uppercase italic tracking-tighter leading-none">
              Correlated <span className="text-[var(--accent)]">Archives</span>
            </h2>
            <p className={`${monoFont} text-[var(--text-dim)] mt-2`}>Neural Match Integrity: High</p>
          </div>
        </div>
        <div className="h-px flex-1 mx-12 bg-gradient-to-r from-[var(--border)] to-transparent hidden md:block" />
      </div>

      {/* NOVEL GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {recommendedNovels.slice(0, 6).map((novel) => {
          const coverUrl = novel.coverImage?.startsWith('http') 
            ? novel.coverImage 
            : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

          return (
            <Link
              key={novel._id}
              to={`/novel/${novel._id}`}
              className={`group relative flex flex-col h-full rounded-[2rem] overflow-hidden ${glassEffect}`}
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-primary)]">
                <img
                  src={coverUrl || "https://api.dicebear.com/7.x/shapes/svg?seed=Arch"}
                  alt={novel.title}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-90" />
                
                {/* FLOATING RATING */}
                <div className="absolute top-3 right-3 bg-[var(--bg-primary)] opacity-90 backdrop-blur-md px-2 py-1 rounded-xl border border-[var(--border)] flex items-center gap-1.5 shadow-xl">
                  <Star size={10} className="fill-[var(--accent)] text-[var(--accent)]" />
                  <span className="font-mono text-[9px] font-black text-[var(--text-main)]">{novel.rating || "4.8"}</span>
                </div>
              </div>

              {/* METADATA */}
              <div className="p-5 flex flex-col flex-1 text-left">
                <h3 className="text-[11px] font-black text-[var(--text-main)] uppercase tracking-tighter leading-tight line-clamp-2 group-hover:text-[var(--accent)] transition-colors mb-4 italic">
                  {novel.title}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={11} className="text-[var(--accent)] opacity-60" />
                    <span className={`${monoFont} text-[var(--text-dim)]`}>
                      Nodes : {novel.totalChapters || 0}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--accent)] group-hover:shadow-[0_0_8px_var(--accent-glow)] transition-all" />
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