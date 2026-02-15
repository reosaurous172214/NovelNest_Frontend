import React from "react";
import { 
  LuBookOpen, LuHistory, LuClock, LuHeart, LuRocket, LuPlay 
} from "react-icons/lu"; 
import { useNavigate } from "react-router-dom";
import MetricCard from "./MetricCard";
import ActivityItem from "./ActivityItem";

const OverviewTab = ({ user, hours, activities, lastRead, loading }) => {
  const navigate = useNavigate();
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x450";
    return path.startsWith("http") ? path : `${process.env.REACT_APP_API_URL}${path}`;
  };

  // Premium Check for consistent UI
  const isPremium = user?.subscription?.plan && user?.subscription?.plan !== "free";

  // Calculate Progress Safely
  const progressPercent = lastRead 
    ? Math.min(100, Math.round((lastRead.lastReadChapter / (lastRead.totalChapters || 100)) * 100)) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-in fade-in duration-700 font-sans antialiased">
      <div className="lg:col-span-8 space-y-6 md:space-y-8">
        
        {/* --- METRICS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <MetricCard 
            icon={<LuBookOpen size={18} />} 
            label="Collection" 
            value={user?.bookmarks?.length || 0} 
          />
          <MetricCard 
            icon={<LuClock size={18} />} 
            label="Hours" 
            value={`${hours}h`} 
          />
          <MetricCard 
            icon={<LuHeart size={18} />} 
            label="Favorites" 
            value={user?.favourites?.length || 0} 
          />
          <MetricCard 
            icon={<LuRocket size={18} />} 
            label="Works" 
            value={user?.role === 'author' ? (user?.myNovels?.length || 0) : "0"} 
          />
        </div>

        {/* --- FEATURED CONTINUE READING CARD --- */}
        <section className={`p-6 md:p-10 rounded-[2rem] bg-[var(--bg-secondary)] border text-left relative overflow-hidden group min-h-[280px] flex items-center shadow-xl transition-all duration-500 ${isPremium ? 'border-yellow-500/20' : 'border-[var(--border)]'}`}>
          
          {/* Background Glow for Premium */}
          {isPremium && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] -z-10 pointer-events-none" />
          )}

          {loading ? (
            /* 1. SKELETON STATE - Fixed dimensions to stop flickering */
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center w-full animate-pulse">
              <div className="w-28 h-40 md:w-32 md:h-48 bg-[var(--bg-primary)] rounded-2xl shrink-0" />
              <div className="flex-1 space-y-4 w-full">
                <div className="h-3 w-24 bg-[var(--bg-primary)] rounded-full" />
                <div className="h-10 w-3/4 bg-[var(--bg-primary)] rounded-xl" />
                <div className="space-y-3 pt-4">
                   <div className="h-2 w-full bg-[var(--bg-primary)] rounded-full" />
                   <div className="h-2 w-1/2 bg-[var(--bg-primary)] rounded-full" />
                </div>
              </div>
            </div>
          ) : lastRead ? (
            /* 2. DATA STATE - Smooth fade-in transition */
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="w-28 h-40 md:w-32 md:h-48 bg-black rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)] shrink-0 relative">
                    <img 
                      src={getImageUrl(lastRead.coverImage)}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300x450" }}
                      alt="cover" 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" 
                    />
                </div>
                <div className="flex-1 space-y-5 md:space-y-6 text-center sm:text-left min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Current Reading</span>
                        {isPremium && (
                            <span className="w-fit mx-auto sm:mx-0 text-[8px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 uppercase tracking-tighter">Premium Access</span>
                        )}
                    </div>
                    
                    <h2 className="text-2xl font-bold leading-tight truncate text-[var(--text-main)]">
                      {lastRead.title}
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
                        <div 
                          className="bg-[var(--accent)] h-full transition-all duration-1000 ease-out" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold opacity-60 tracking-wider uppercase">
                        <span>Chapter {lastRead.lastReadChapter}</span>
                        <span>{progressPercent}% Complete</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/novel/${lastRead.novelId}/chapter/${lastRead.lastReadChapter}`)}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--accent)] text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg"
                    >
                      <LuPlay size={10} fill="currentColor" /> Resume
                    </button>
                </div>
            </div>
          ) : (
            /* 3. EMPTY STATE - Stable height maintenance */
            <div className="w-full text-center py-10 opacity-30 flex flex-col items-center gap-4 animate-in fade-in">
                <LuBookOpen size={32} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">No reading logs detected</p>
            </div>
          )}
        </section>
      </div>
      
      {/* --- ACTIVITY SIDEBAR --- */}
      <div className="lg:col-span-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2rem] p-6 h-full flex flex-col shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-8 flex items-center gap-2 border-b border-[var(--border)] pb-4 text-left">
              <LuHistory className="text-[var(--accent)]" size={16}/> Recent History
            </h3>
            
            <div className="space-y-5 flex-1 overflow-y-auto max-h-[350px] lg:max-h-[450px] no-scrollbar">
              {activities.length > 0 ? (
                activities.slice(0, 6).map((a, i) => <ActivityItem key={a._id || i} activity={a} />)
              ) : (
                <div className="py-12 text-center opacity-30 text-xs font-semibold tracking-wide uppercase">
                  No signals found
                </div>
              )}
            </div>
            
            <button 
              onClick={() => navigate('/history')}
              className="mt-8 w-full py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all active:scale-95"
            >
              Access Full Logs
            </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;