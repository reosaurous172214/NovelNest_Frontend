import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie
} from 'recharts';
import { 
  LuTrendingUp, LuDollarSign, LuUsers, LuRefreshCw, LuZap, 
  LuArrowUpRight, LuArrowDownRight, LuBox, LuAward 
} from "react-icons/lu";
import { getHeaders } from '../../getItems/getAuthItems';

export default function AdvancedAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Syncing colors with your CSS Variable --accent
  const THEME_ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
  const COLORS = [THEME_ACCENT, '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  const fetchSync = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/analytics`, getHeaders());
      if (res.data) setData(res.data);
    } catch (err) {
      console.error("Backend fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSync(); }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const chartData = useMemo(() => {
    if (!data?.charts?.revenue) return [];
    return data.charts.revenue.map(d => ({
      name: months[d._id.month - 1] || 'N/A',
      amount: d.amount
    }));
  }, [data]);

  const genreData = useMemo(() => {
    if (!data?.charts?.genres) return [];
    return data.charts.genres.map((g, i) => ({
      ...g,
      fill: COLORS[i % COLORS.length]
    }));
  }, [data]);

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
      <LuRefreshCw className="animate-spin text-[var(--accent)]" size={32} />
      <p className="text-sm font-medium text-[var(--text-dim)] tracking-wide">Initializing Analytics Core...</p>
    </div>
  );

  if (!data) return (
    <div className="text-center p-20 border border-dashed border-[var(--border)] rounded-3xl">
      <p className="text-[var(--text-dim)] font-medium font-bank-sharp">System Link Severed. No data detected.</p>
      <button onClick={fetchSync} className="mt-4 text-[var(--accent)] hover:brightness-125 font-semibold underline underline-offset-4">Retry Uplink</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-700 text-[var(--text-main)] font-bank-crisp">
      
      {/* 1. Themed Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)] underline decoration-[var(--accent)] decoration-2 underline-offset-8 uppercase italic">
            Admin<span className="text-[var(--accent)]"> Intelligence</span>
          </h1>
          <p className="text-sm text-[var(--text-dim)] mt-4 font-medium">
            Platform throughput and engagement intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSync} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-all active:scale-90">
            <LuRefreshCw size={18} className="text-[var(--text-dim)]" />
          </button>
          <div className="flex items-center gap-2 bg-[var(--accent)] px-4 py-2 rounded-lg text-white font-semibold shadow-[0_0_15px_rgba(0,0,0,0.2)]">
             <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Velocity</span>
             <span className="text-sm font-bold">{data.summary.growthRate >= 0 ? '+' : ''}{data.summary.growthRate}%</span>
          </div>
        </div>
      </header>

      {/* 2. KPI Section - Using Theme Variables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard label="Total Revenue" value={`$${(data.summary.totalRevenue || 0).toLocaleString()}`} icon={<LuDollarSign size={18}/>} />
        <KpiCard label="Monthly Flow" value={`$${(data.summary.monthlyRevenue || 0).toLocaleString()}`} icon={<LuTrendingUp size={18}/>} />
        <KpiCard label="Throughput" value={data.summary.activeDeals || 0} icon={<LuBox size={18}/>} />
        <KpiCard label="Avg Retention" value="84.2%" icon={<LuUsers size={18}/>} />
      </div>

      {/* 3. Charts Section - Using --bg-secondary and --border */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text-main)] mb-8 flex items-center gap-2 italic uppercase tracking-wider">
            <LuTrendingUp size={16} className="text-[var(--accent)]" /> Revenue Trajectory
          </h3>
          <div className="h-64 w-full font-bank-sharp">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-dim)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="var(--accent)" strokeWidth={2} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-[var(--text-main)] mb-6 italic uppercase tracking-wider">Market Share</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genreData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="count" stroke="none" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {data.charts.genres.map((g, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="font-medium text-[var(--text-dim)] uppercase">{g._id}</span>
                </div>
                <span className="font-semibold">{g.count} titles</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Novels & Power Readers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Novels - Using Table Theme */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-primary)]">
            <h3 className="text-sm font-semibold text-[var(--text-main)] italic flex items-center gap-2 uppercase tracking-widest">
              <LuZap className="text-[var(--accent)]" size={16} /> Momentum Scorecard
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[var(--border)]">
                {data.topContent.map((novel, i) => (
                  <tr key={i} className="hover:bg-[var(--accent)]/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--text-main)]">{novel.title}</p>
                      <span className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-wider italic">{novel.genres?.[0]}</span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[var(--accent)]" 
                                    style={{ width: `${Math.min((novel.engagementScore || 0) * 10, 100)}%` }} 
                                />
                            </div>
                            <span className="text-[10px] font-bold text-[var(--text-dim)] font-mono">{novel.views.toLocaleString()}</span>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Power Readers - Glass Effect */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-primary)]">
            <h3 className="text-sm font-semibold text-[var(--text-main)] italic flex items-center gap-2 uppercase tracking-widest">
              <LuAward className="text-emerald-500" size={16} /> Core Contributors
            </h3>
          </div>
          <div className="p-2 divide-y divide-[var(--border)]">
            {data.topReaders?.map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-[var(--accent)]/[0.05] transition-all rounded-xl">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.profilePicture} 
                    alt="profile" 
                    className="w-9 h-9 rounded-full border border-[var(--border)] object-cover"
                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user.username; }}
                  />
                  <div>
                    <p className="text-xs font-bold text-[var(--text-main)] uppercase tracking-tight">{user.username}</p>
                    <p className="text-[10px] text-[var(--text-dim)] font-medium">Rank #{i + 1} Neural Reader</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500 font-mono">{user.readingStats?.totalChaptersRead || 0} CAPS</p>
                  <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-tighter italic">Acquired</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component tailored to your tech theme
function KpiCard({ label, value, icon }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-5 rounded-xl hover:border-[var(--accent)] transition-all group overflow-hidden relative">
      <div className="text-[var(--text-dim)] mb-4 group-hover:text-[var(--accent)] transition-colors relative z-10">{icon}</div>
      <p className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-widest relative z-10">{label}</p>
      <h4 className="text-xl font-bold mt-1 text-[var(--text-main)] font-bank-crisp relative z-10">{value}</h4>
      {/* Subtle Glow Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)] opacity-[0.02] blur-3xl group-hover:opacity-[0.05] transition-opacity"></div>
    </div>
  );
}

// Tooltip matched to Glass Midnight Theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.[0]) {
    return (
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] px-4 py-3 rounded-lg shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1.5">{label} Timeline</p>
        <p className="text-xs font-bold text-[var(--text-main)] flex justify-between gap-6 uppercase">
          Flux: <span className="text-[var(--accent)]">${payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};