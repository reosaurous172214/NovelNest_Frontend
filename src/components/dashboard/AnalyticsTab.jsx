import React, { useEffect, useState } from 'react';
import { 
  RiFireLine, RiBook3Line, RiLineChartLine, RiUserHeartLine, 
  RiQuillPenLine, RiVipCrownLine, RiCalendarCheckLine, RiArrowUpSLine
} from "react-icons/ri"; // Modern Remix Icons
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AuthorAnalytics = () => {
  const { user } = useAuth();
  const isAuthor = user?.role === "author" || user?.role === "admin";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ metrics: {}, history: [] });

  useEffect(() => {
    const fetchRealAnalytics = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/analytics/summary`, config);
        setData(res.data);
      } catch (err) {
        console.error("Neural sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealAnalytics();
  }, []);

  if (loading) return (
    <div className="py-20 text-center animate-pulse">
      <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20 text-[var(--accent)]">Syncing Analytics...</p>
    </div>
  );

  const { metrics, history } = data;
  const chartData = history.map(day => ({
    day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    minutes: day.readingMinutes || 0
  }));

  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60);

  return (
    <div className="space-y-12 text-left animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* SECTOR 1: READING BEHAVIOR */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)] whitespace-nowrap">Reader Engagement Pulse</h2>
          <div className="h-px w-full bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Continuity Card */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-8 rounded-2xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest">Active Streak</span>
                <RiFireLine className="text-orange-500 text-xl" />
              </div>
              <h4 className="text-4xl font-bold text-[var(--text-main)]">
                {metrics.daysActive || 0} <span className="text-xs font-medium text-[var(--text-dim)]">Days</span>
              </h4>
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-tight">
                <RiArrowUpSLine size={16} /> +12% from last week
              </div>
            </div>
          </div>

          {/* Intensity Graph */}
          <div className="lg:col-span-3 bg-[var(--bg-secondary)] border border-[var(--border)] p-8 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest">Daily Reading Intensity</span>
              <div className="px-3 py-1 bg-[var(--accent)]/10 rounded-full">
                <span className="text-[10px] text-[var(--accent)] font-bold">{metrics.totalMinutes || 0}m Total Pulse</span>
              </div>
            </div>
            <div className="h-40 flex items-end justify-between gap-3 px-2">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div 
                    className="w-full bg-[var(--border)] group-hover:bg-[var(--accent)] transition-all duration-300 rounded-t-lg relative cursor-help"
                    style={{ height: `${Math.min((d.minutes / maxMinutes) * 100, 100)}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all bg-[var(--accent)] px-2 py-1 rounded shadow-lg z-20 pointer-events-none">
                      {d.minutes}m
                    </div>
                  </div>
                  <span className="mt-4 text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-tighter">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR 2: AUTHOR METRICS */}
      {isAuthor && (
        <section className="animate-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] whitespace-nowrap">Manuscript Architecture</h2>
            <div className="h-px w-full bg-gradient-to-r from-[var(--accent)]/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--accent)]/30 p-8 rounded-3xl relative overflow-hidden group shadow-2xl">
              <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <RiVipCrownLine size={120} className="text-[var(--accent)]" />
              </div>
              <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-2">Primary IP</p>
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-6">Author Portfolio</h3>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold tracking-tighter">Published</p>
                  <p className="text-2xl font-bold text-[var(--accent)]">{metrics.published || 0}</p>
                </div>
                <div className="h-10 w-[1px] bg-[var(--border)]" />
                <div>
                  <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold tracking-tighter">Chapters</p>
                  <p className="text-2xl font-bold text-[var(--text-main)]">{metrics.totalChapters || 0}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <AuthorMetric icon={<RiBook3Line />} label="Novels Authored" value={metrics.published || 0} desc="Total IP registered" />
              <AuthorMetric icon={<RiUserHeartLine />} label="Reader Loyalty" value={metrics.favorites || 0} desc="Unique reader saves" color="text-rose-500" />
              <AuthorMetric icon={<RiQuillPenLine />} label="Lexical Volume" value={`${(metrics.totalWords / 1000).toFixed(1)}k`} desc="Words synchronized" color="text-[var(--accent)]" />
              <AuthorMetric icon={<RiCalendarCheckLine />} label="Session Reliability" value={`${metrics.daysActive || 0}`} desc="Days of creation" color="text-emerald-500" />
            </div>
          </div>
        </section>
      )}

      {/* SECTOR 3: ANALYTICS INSIGHT (NEW) */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-lg`}>
            <div className="flex items-center gap-3 mb-4">
               <RiLineChartLine className="text-[var(--accent)]" size={20}/>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)]">Growth Insight</h3>
            </div>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed">
              Your reading intensity has increased by <span className="text-[var(--accent)] font-bold">18.4%</span> this period. Authors with this trend typically see <span className="text-emerald-500 font-bold">higher retention</span> on new chapter releases.
            </p>
          </div>
          
          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">Account Standing</h3>
              <p className="text-xl font-bold text-[var(--text-main)] uppercase">Verified Creator</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <RiShieldLine size={24} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

const AuthorMetric = ({ icon, label, value, desc, color = "text-[var(--accent)]" }) => (
  <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl hover:border-[var(--accent)]/30 transition-all flex items-center gap-5 group">
    <div className={`p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl ${color} group-hover:scale-105 transition-transform`}>
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <div>
      <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{value}</h4>
        <RiArrowUpSLine className="text-emerald-500" />
      </div>
      <p className="text-[9px] text-[var(--text-dim)] font-medium uppercase tracking-tight opacity-50">{desc}</p>
    </div>
  </div>
);

const RiShieldLine = ({ size }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

export default AuthorAnalytics;