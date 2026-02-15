import { 
  LuBookOpen, LuHistory, LuClock, LuHeart, LuRocket, LuPlay 
} from "react-icons/lu"; 
import { useNavigate } from "react-router-dom";
import MetricCard from "./MetricCard";
import ActivityItem from "./ActivityItem";

const OverviewTab = ({ user, hours, activities, lastRead, loading }) => {
  const navigate = useNavigate();

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
            value="0" 
          />
        </div>

        {/* --- FEATURED CONTINUE READING CARD --- */}
        <section className="p-6 md:p-10 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border)] text-left relative overflow-hidden group min-h-[240px] flex items-center shadow-xl transition-all duration-500">
          {loading ? (
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center w-full animate-pulse">
              <div className="w-28 h-40 md:w-32 md:h-48 bg-[var(--bg-primary)] rounded-2xl" />
              <div className="flex-1 space-y-4 w-full">
                <div className="h-2 w-24 bg-[var(--bg-primary)] rounded" />
                <div className="h-8 md:h-10 w-3/4 bg-[var(--bg-primary)] rounded" />
                <div className="h-2 w-full bg-[var(--bg-primary)] rounded" />
              </div>
            </div>
          ) : lastRead ? (
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center w-full">
                <div className="w-28 h-40 md:w-32 md:h-48 bg-black rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)] flex-shrink-0 relative">
                    <img 
                      src={lastRead.coverImage || "https://via.placeholder.com/300x450"} 
                      alt="cover" 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700" 
                    />
                </div>
                <div className="flex-1 space-y-5 md:space-y-7 text-center sm:text-left min-w-0 w-full">
                    <span className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-widest">Current Reading</span>
                    <h2 className="text-2xl font-semibold  leading-tight truncate">
                      {lastRead.title}
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
                        <div 
                          className="bg-[var(--accent)] h-full transition-all duration-1000 ease-out" 
                          style={{ width: `${(lastRead.lastReadChapter / (lastRead.totalChapters || 100)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-semibold opacity-60 tracking-wide uppercase">
                        <span>Chapter {lastRead.lastReadChapter}</span>
                        <span>{Math.round((lastRead.lastReadChapter / (lastRead.totalChapters || 100)) * 100)}% Complete</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/novel/${lastRead.novelId}/chapter/${lastRead.lastReadChapter}`)}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--accent)] text-white px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg"
                    >
                      <LuPlay size={10} /> Resume
                    </button>
                </div>
            </div>
          ) : (
            <div className="w-full text-center py-10 opacity-30 flex flex-col items-center gap-4">
               <LuBookOpen size={32} />
               <p className="text-xs font-semibold uppercase tracking-widest">No reading logs detected</p>
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
            
            <button className="mt-8 w-full py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[10px] font-semibold uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
              Access Full Logs
            </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;