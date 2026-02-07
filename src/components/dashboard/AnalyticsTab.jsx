import React, { useEffect, useState } from 'react';
import { FaFire, FaBook, FaChartLine, FaUsers, FaPenNib, FaCrown, FaCalendarCheck } from "react-icons/fa";
import axios from 'axios';

const AuthorAnalytics = ({ isAuthor = true }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        metrics: {},
        history: []
    });

    useEffect(() => {
        const fetchRealAnalytics = async () => {
            try {
                const config = { 
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
                };
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/analytics/summary`, config);
                setData(res.data);
            } catch (err) {
                console.error("Failed to sync neural analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRealAnalytics();
    }, []);

    if (loading) return (
        <div className="py-20 text-center animate-pulse">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Syncing Analytics...</p>
        </div>
    );

    const { metrics, history } = data;

    // 🔥 MODIFIED: Changed hours to minutes and added a scaling factor for visibility
    const chartData = history.map(day => ({
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: day.readingMinutes || 0
    }));

    // Find the max minutes in the current history to scale the graph height relatively
    const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60); // Minimum scale of 60 mins

    return (
        <div className="space-y-10 text-left animate-in fade-in duration-700 max-w-7xl mx-auto">
            
            {/* SECTOR 1: NEURAL SYNC (Reader Analytics) */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-dim)]">Neural Sync / Reading Behavior</h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Continuity Card */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-wider">Continuity</span>
                                <FaFire className="text-orange-500 text-xs animate-pulse" />
                            </div>
                            <h4 className="text-3xl font-bold text-[var(--text-main)] tracking-tighter">
                                {metrics.daysActive || 0} <span className="text-xs font-medium text-[var(--text-dim)]">Days</span>
                            </h4>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--border)]">
                            <p className="text-[9px] text-[var(--text-dim)] leading-relaxed uppercase tracking-tight">
                                <span className="text-emerald-500 font-bold">Active Status</span> • Synchronized across {metrics.booksRead || 0} Manuscripts
                            </p>
                        </div>
                    </div>

                    {/* 🔥 MODIFIED: Reading Intensity Graph (Showing Minutes) */}
                    <div className="lg:col-span-3 bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-wider">Reading Intensity / Daily Minutes</span>
                            <span className="text-[10px] font-mono text-[var(--accent)] font-bold">{metrics.totalMinutes || 0}m Accumulated</span>
                        </div>
                        <div className="h-32 flex items-end justify-between gap-2 md:gap-4 px-2">
                            {chartData.length > 0 ? chartData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                                    <div 
                                        className="w-full bg-[var(--border)] group-hover:bg-[var(--accent)] transition-all duration-500 rounded-t-sm relative"
                                        style={{ 
                                            // Scale height based on maxMinutes to ensure small values (1-3m) are visible
                                            height: `${Math.min((d.minutes / maxMinutes) * 1000, 100)}%`, 
                                            minHeight: d.minutes > 0 ? '6px' : '2px' 
                                        }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[var(--text-main)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[var(--bg-primary)] px-1 rounded border border-[var(--border)] z-10">
                                            {d.minutes}m
                                        </div>
                                    </div>
                                    <span className="mt-3 text-[8px] font-bold text-[var(--text-dim)] uppercase">{d.day}</span>
                                </div>
                            )) : (
                                <div className="w-full text-center pb-10 opacity-20 text-[10px] uppercase font-black tracking-widest">No Pulse Data Detected</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTOR 2: ARCHITECT PROTOCOL */}
            {isAuthor && (
                <section className="animate-in slide-in-from-bottom-6 duration-1000">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Architect Protocol / Creation</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--accent)]/20 p-8 rounded-3xl relative overflow-hidden group shadow-lg">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <FaCrown size={80} className="text-[var(--accent)]" />
                            </div>
                            <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1">Creation Summary</p>
                            <h3 className="text-xl font-black text-[var(--text-main)] italic mb-4 leading-tight">Master Portfolio</h3>
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="text-[8px] text-[var(--text-dim)] uppercase font-black">Published</p>
                                    <p className="text-lg font-bold text-[var(--accent)]">{metrics.published || 0}</p>
                                </div>
                                <div className="h-8 w-px bg-[var(--border)]" />
                                <div>
                                    <p className="text-[8px] text-[var(--text-dim)] uppercase font-black">Chapters</p>
                                    <p className="text-lg font-bold text-[var(--text-main)]">{metrics.totalChapters || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AuthorMetric icon={<FaBook />} label="Manuscripts Authored" value={metrics.published || 0} desc="Verified IP Portfolio" />
                            <AuthorMetric icon={<FaUsers />} label="Neural Engagement" value={`${metrics.favorites || 0}`} desc="Favorited By Users" />
                            <AuthorMetric icon={<FaPenNib />} label="Lexical Output" value={`${(metrics.totalWords / 1000).toFixed(1)}k`} desc="Total Words Written" />
                            <AuthorMetric icon={<FaCalendarCheck />} label="Session Reliability" value={`${metrics.daysActive || 0}`} desc="Total Active Creation Days" />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

const AuthorMetric = ({ icon, label, value, desc }) => (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl hover:border-[var(--accent)]/30 transition-all flex items-start gap-4 group">
        <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--accent)] group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-wider mb-1">{label}</p>
            <h4 className="text-2xl font-bold text-[var(--text-main)] leading-none mb-1">{value}</h4>
            <p className="text-[8px] text-[var(--text-dim)] font-medium uppercase tracking-tighter opacity-60">{desc}</p>
        </div>
    </div>
);

export default AuthorAnalytics;