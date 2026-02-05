import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCrown, FaFire, FaTrophy, FaBolt,
  FaMagic, FaCheckCircle, FaPlay, FaHeart, 
  FaUserSecret, FaRocket, FaClock, FaEye
} from "react-icons/fa";
import axios from "axios";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop";

const handleImageError = (e) => {
  e.target.src = FALLBACK_IMAGE;
};

/* ================================================================
    1. SUB-COMPONENTS (Apex Banner & Data Displays)
   ================================================================
*/

// APEX BANNER - UNTOUCHED AS REQUESTED
const Banner = ({ spotlight }) => {
  const bgImage = spotlight?.coverImage && spotlight.coverImage.startsWith('http') 
    ? spotlight.coverImage 
    : FALLBACK_IMAGE;

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl flex flex-col md:flex-row items-center min-h-[380px] md:min-h-[420px] transition-all duration-500 mt-12 md:mt-16 bg-[var(--bg-secondary)]">
      
      {/* LAYER 1: THE COLOR GLOW */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src={bgImage} 
          onError={handleImageError}
          className="w-full h-full object-cover blur-[50px] opacity-30 scale-125 transition-all duration-1000" 
          alt="" 
        />
      </div>

      {/* LAYER 2: THE HIGH FROST (Adaptive Backdrop) */}
      <div className="absolute inset-0 backdrop-blur-[45px] bg-[var(--bg-primary)]/40 md:bg-transparent pointer-events-none" />

      {/* CONTENT AREA */}
      <div className="relative z-20 flex-1 p-8 md:p-12 lg:pl-16 space-y-5 text-left">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 backdrop-blur-md">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--accent)] font-bold">Featured Story</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight text-[var(--text-main)] line-clamp-2">
          {spotlight.title}
        </h1>
        
        <p className="text-[var(--text-secondary)] text-sm md:text-base font-medium line-clamp-2 md:line-clamp-3 max-w-xl leading-relaxed">
          {spotlight.description}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link to={`/novel/${spotlight._id}`} className="px-8 py-3.5 bg-[var(--accent)] text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-xl active:scale-95 flex items-center gap-3">
            <FaPlay size={10} /> Start Reading
          </Link>
        </div>
      </div>

      {/* HERO IMAGE VISUAL */}
      <div className="relative z-20 w-full md:w-[360px] h-full hidden md:block p-8 lg:p-10">
        <img 
          src={spotlight.coverImage} 
          onError={handleImageError}
          className="w-full aspect-[2/3] object-cover rounded-[2rem] shadow-2xl border border-[var(--border-color)] transition-transform duration-700 group-hover:scale-[1.02]" 
          alt={spotlight.title} 
        />
      </div>
    </div>
  );
};

const DataPanel = ({ title, icon, data }) => (
  <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-color)] rounded-[2rem] p-6 shadow-xl text-left relative overflow-hidden group">
    <div className="flex items-center gap-4 mb-6">
        <div className="text-xl text-[var(--accent)]">{icon}</div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-main)] opacity-90">{title}</h3>
    </div>
    <div className="space-y-4">
      {data?.map((n, i) => (
        <Link to={`/novel/${n._id}`} key={n._id} className="flex items-center gap-4 p-2 rounded-xl hover:bg-[var(--accent)]/5 transition-all group/item">
          <span className="font-mono text-xs font-bold w-4 text-[var(--text-secondary)] opacity-50">{i + 1}</span>
          <img src={n.coverImage} onError={handleImageError} className="w-10 h-10 rounded-lg object-cover border border-[var(--border-color)]" alt="" />
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-black truncate uppercase text-[var(--text-main)] group-hover/item:text-[var(--accent)]">{n.title}</h4>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const OperationSector = ({ title, sub, icon, data }) => (
  <div className="mb-24 md:mb-32">
    <div className="flex justify-between items-end mb-10 px-4 border-b border-[var(--border-color)] pb-6 text-left">
      <div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[var(--text-main)] flex items-center gap-4">
          <span className="text-[var(--accent)]">{icon}</span>
          {title}
        </h2>
        <p className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest mt-1">{sub}</p>
      </div>
      <Link to="/novels" className="text-[10px] font-black text-[var(--text-secondary)] hover:text-[var(--accent)] uppercase tracking-widest transition-colors">See All</Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {data?.map((novel) => (
        <Link key={novel._id} to={`/novel/${novel._id}`} className="group text-left">
          <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--accent)] shadow-lg mb-3 bg-[var(--bg-secondary)]">
            <img src={novel.coverImage} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
          </div>
          <h4 className="text-[11px] font-black uppercase truncate text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">{novel.title}</h4>
        </Link>
      ))}
    </div>
  </div>
);

/* ================================================================
    2. MAIN HOME COMPONENT
   ================================================================
*/

const Home = () => {
  const [data, setData] = useState({
    spotlight: null, popular: [], highlyRated: [], trending: [],
    action: [], fantasy: [], romance: [], mystery: [], scifi: [], 
    completed: [], recent: [], sleeper: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Limit increased to ensure we have enough data to fill new segments
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/novels`, { params: { limit: 120, sortBy: "views" } });
        const all = res.data.novels || [];

        const validNovels = all.filter(n => 
          n.coverImage && 
          n.coverImage.startsWith('http') && 
          !n.coverImage.toLowerCase().includes('no-image')
        );

        const spotlightPool = validNovels.length > 0 ? validNovels : all;
        const randomSpotlight = spotlightPool[Math.floor(Math.random() * Math.min(spotlightPool.length, 20))];

        setData({
          spotlight: randomSpotlight,
          popular: all.slice(0, 5),
          highlyRated: [...all].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5),
          trending: all.slice(5, 10),
          action: all.filter(n => n.genres?.some(g => g.toLowerCase() === "action")).slice(0, 6),
          fantasy: all.filter(n => n.genres?.some(g => g.toLowerCase() === "fantasy")).slice(0, 6),
          romance: all.filter(n => n.genres?.some(g => g.toLowerCase() === "romance")).slice(0, 6),
          mystery: all.filter(n => n.genres?.some(g => g.toLowerCase() === "mystery")).slice(0, 6),
          scifi: all.filter(n => n.genres?.some(g => g.toLowerCase() === "sci-fi" || g.toLowerCase() === "science fiction")).slice(0, 6),
          completed: all.filter(n => n.status?.toLowerCase() === "completed").slice(0, 6),
          recent: [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
          sleeper: all.filter(n => (n.views || 0) < 1000 && (n.rating || 0) >= 4).slice(0, 6)
        });
      } catch (err) {
        console.error("Home loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] text-[var(--accent)] uppercase tracking-widest font-bold animate-pulse">Loading Archive...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 md:py-20 px-4 md:px-8 transition-colors duration-500">
      
      {/* FEATURED BANNER */}
      <section className="max-w-7xl mx-auto mb-16 md:mb-20">
        {data.spotlight && <Banner spotlight={data.spotlight} />}
      </section>

      <main className="max-w-7xl mx-auto">
        
        {/* TOP METRIC PANELS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 md:mb-32">
          <DataPanel title="Most Popular" icon={<FaFire />} data={data.popular} />
          <DataPanel title="Top Rated" icon={<FaCrown />} data={data.highlyRated} />
          <DataPanel title="Trending Now" icon={<FaTrophy />} data={data.trending} />
        </section>

        {/* DYNAMIC CATEGORY SECTORS */}
        <OperationSector 
          title="New Releases" 
          sub="Fresh From The Press" 
          icon={<FaClock size={20}/>} 
          data={data.recent} 
        />

        <OperationSector 
          title="Action" 
          sub="High-Octane Combat" 
          icon={<FaBolt size={20}/>} 
          data={data.action} 
        />

        <OperationSector 
          title="Fantasy" 
          sub="Worlds of Magic" 
          icon={<FaMagic size={20}/>} 
          data={data.fantasy} 
        />

        <OperationSector 
          title="Romance" 
          sub="Heartfelt Tales" 
          icon={<FaHeart size={20}/>} 
          data={data.romance} 
        />

        <OperationSector 
          title="Sci-Fi" 
          sub="Technological Frontiers" 
          icon={<FaRocket size={20}/>} 
          data={data.scifi} 
        />

        <OperationSector 
          title="Mystery" 
          sub="Unravel the Secret" 
          icon={<FaUserSecret size={20}/>} 
          data={data.mystery} 
        />

        <OperationSector 
          title="Hidden Gems" 
          sub="Underappreciated Masterpieces" 
          icon={<FaEye size={20}/>} 
          data={data.sleeper} 
        />

        <OperationSector 
          title="Completed" 
          sub="Finished Journeys" 
          icon={<FaCheckCircle size={20}/>} 
          data={data.completed} 
        />
      </main>
    </div>
  );
};

export default Home;