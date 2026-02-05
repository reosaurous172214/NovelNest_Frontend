import { 
  FaBookOpen, FaHistory, FaClock, FaHeart, FaRocket
  , FaChartLine,  FaTerminal, FaPlay 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MetricCard from "./MetricCard";
import ActivityItem from "./ActivityItem";
const OverviewTab = ({ user, hours, activities, lastRead, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-8 space-y-6 md:space-y-8">
        
        {/* Responsive Metrics Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
  <MetricCard 
    icon={<FaBookOpen />} 
    label="Collection" 
    value={user?.bookmarks?.length || 0} 
  />
  <MetricCard 
    icon={<FaClock />} 
    label="Hours" 
    value={`${hours}h`} 
  />
  <MetricCard 
    icon={<FaHeart />} 
    label="Favorites" 
    value={user?.favourites?.length || 0} 
  />
  <MetricCard 
    icon={<FaRocket />} 
    label="Works" 
    value="0" 
  />
</div>
        {/* Responsive Featured Card */}
        <section className="p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-[var(--bg-secondary)] border border-[var(--border)] text-left relative overflow-hidden group min-h-[240px] flex items-center shadow-2xl transition-all duration-500">
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
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                    />
                </div>
                <div className="flex-1 space-y-3 md:space-y-5 text-center sm:text-left min-w-0 w-full">
                    <span className="text-[8px] md:text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] md:tracking-[0.4em]">Active Mission</span>
                    <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter leading-tight md:leading-none truncate italic">
                      {lastRead.title}
                    </h2>
                    
                    <div className="space-y-2">
                      <div className="w-full bg-[var(--bg-primary)] h-1 md:h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
                        <div 
                          className="bg-[var(--accent)] h-full transition-all duration-1000 ease-out" 
                          style={{ width: `${(lastRead.lastReadChapter / (lastRead.totalChapters || 100)) * 100}%` }}
                        />
                      </div>
                      <p className="text-[7px] md:text-[9px] font-black opacity-30 tracking-widest uppercase">
                        Chapter {lastRead.lastReadChapter} // SYNC: {Math.round((lastRead.lastReadChapter / (lastRead.totalChapters || 100)) * 100)}%
                      </p>
                    </div>

                    <button 
                      onClick={() => navigate(`/novel/${lastRead.novelId}/chapter/${lastRead.lastReadChapter}`)}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--accent)] text-white px-6 md:px-10 py-3 md:py-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[var(--accent)]/20"
                    >
                      <FaPlay size={8} /> Resume Reading
                    </button>
                </div>
            </div>
          ) : (
            <div className="w-full text-center py-10 opacity-20 italic flex flex-col items-center gap-4">
               <FaBookOpen className="text-3xl md:text-4xl" />
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">No local logs detected</p>
            </div>
          )}
        </section>
      </div>
      
      {/* Activity Sidebar: Spans full width on mobile, 4 columns on desktop */}
      <div className="lg:col-span-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 h-full flex flex-col shadow-xl">
           <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4 text-left">
             <FaHistory className="text-[var(--accent)]"/> Recent Bursts
           </h3>
           
           <div className="space-y-4 md:space-y-5 flex-1 overflow-y-auto max-h-[300px] lg:max-h-[400px] no-scrollbar">
              {activities.length > 0 ? (
                activities.slice(0, 6).map((a, i) => <ActivityItem key={a._id || i} activity={a} />)
              ) : (
                <div className="py-10 text-center opacity-20 text-[9px] font-black uppercase tracking-widest italic">
                  No Signals Recorded
                </div>
              )}
           </div>
           
           <button className="mt-6 w-full py-3 md:py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[9px] font-black uppercase tracking-widest hover:border-[var(--accent)] transition-all">
             Archive Access
           </button>
        </div>
      </div>
    </div>
  );
};
export default OverviewTab;