import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Star, Bookmark, BookOpen, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";

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
        
        // Ensure we only show complete data
        const validBooks = (res.data || []).filter(novel => novel && novel.title && novel._id);
        setRecommendedNovels(validBooks); 
      } catch (err) {
        console.error("Could not load recommendations", err);
        setError("Recommendations currently unavailable");
      } finally {
        setTimeout(() => setLoading(false), 500); 
      }
    };

    if (novelId) fetchRecommendedNovels();
  }, [novelId]);

  if (loading) return <LoadingState />;
  if (error || !recommendedNovels.length) return null;

  return (
    <section className="pt-20 text-left border-t border-[var(--border)]/20">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--accent)]/10 rounded-xl text-[var(--accent)]">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] tracking-tight">
              Stories You Might <span className="text-[var(--accent)]">Like</span>
            </h2>
            <p className="text-xs text-[var(--text-dim)] font-medium mt-1">Based on your current read</p>
          </div>
        </div>
      </div>

      {/* Grid of Stories */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } }
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        {recommendedNovels.slice(0, 6).map((novel) => (
          <NovelCard key={novel._id} novel={novel} />
        ))}
      </motion.div>
    </section>
  );
};

/* Individual Story Card */
const NovelCard = ({ novel }) => {
  const coverUrl = novel.coverImage?.startsWith('http') 
    ? novel.coverImage 
    : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
      }}
    >
      <Link
        to={`/novel/${novel._id}`}
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-primary)]">
          <img
            src={coverUrl || "https://api.dicebear.com/7.x/shapes/svg?seed=Book"}
            alt={novel.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5">
            <Star size={10} className="fill-[var(--accent)] text-[var(--accent)]" />
            <span className="text-[10px] font-bold text-white">{novel.rating || "4.8"}</span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-[var(--text-main)] line-clamp-2 mb-3 group-hover:text-[var(--accent)] transition-colors">
            {novel.title}
          </h3>

          <div className="mt-auto flex items-center justify-between text-[var(--text-dim)]">
            <div className="flex items-center gap-1.5">
              <BookOpen size={12} />
              <span className="text-[10px]">{novel.totalChapters || 0} Chapters</span>
            </div>
            <Heart size={12} className="group-hover:text-red-400 transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* Loading State */
const LoadingState = () => (
  <div className="py-20 space-y-10 opacity-50">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-xl animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 w-48 bg-[var(--bg-secondary)] rounded animate-pulse" />
        <div className="h-3 w-32 bg-[var(--bg-secondary)] rounded animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-[3/4.5] bg-[var(--bg-secondary)] rounded-2xl animate-pulse" />
      ))}
    </div>
  </div>
);

export default RecommendedNovels;