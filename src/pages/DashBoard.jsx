import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useActivity from "../hooks/useActivity";
import useLastRead from "../hooks/useHistory";

// Components
import OverviewTab from "../components/dashboard/OverviewTab";
import AnalyticsTab from "../components/dashboard/AnalyticsTab";
import Library from "./lib/Library";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { activities = [], hours = "0.0" } = useActivity(user);
  const { getLastRead, getting: historyLoading } = useLastRead();
  
  const [lastReadData, setLastReadData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const initHistory = async () => {
      if (user) {
        try {
          const res = await getLastRead();
          if (res && res.length > 0) {
            const latest = res[0];
            setLastReadData({
              ...(latest.novel || latest),
              lastReadChapter: latest.chapterNumber || 1,
              updatedAt: latest.updatedAt || latest.viewedAt,
              novelId: latest.novel?._id || latest._id
            });
          }
        } catch (err) { console.error(err); }
      }
    };
    initHistory();
  }, [user, getLastRead]);

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-20 md:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
        
        {/* Header and Nav as you had it... */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-[var(--border)] pb-6 gap-6">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
              <span className="text-[var(--accent)]">Dashboard</span>
            </h1>
            <nav className="w-full lg:w-auto overflow-x-auto no-scrollbar bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border)]">
                <div className="flex whitespace-nowrap min-w-max">
                    {["overview", "analytics", "library"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 md:px-8 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-[var(--accent)] text-white shadow-lg" : "text-[var(--text-dim)]"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </nav>
        </div>

        {/* Modular Tabs */}
        <div className="min-h-[50vh]">
          {activeTab === "overview" && (
            <OverviewTab user={user} hours={hours} activities={activities} lastRead={lastReadData} loading={historyLoading} />
          )}
          {activeTab === "analytics" && (
            <AnalyticsTab activities={activities} hours={hours} />
          )}
          {activeTab === "library" && (
            <Library isDash={true} />
          )}
        </div>
      </div>
    </div>
  );
}