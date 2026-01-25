import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoLibrary, IoTrashOutline } from "react-icons/io5"; 
import { FaHistory, FaHeart, FaBookmark, FaLock, FaSignInAlt, FaArrowRight, FaPlay, FaUserAlt } from "react-icons/fa";

const TABS = {
    HISTORY: "history",
    FAVOURITES: "favourites",
    BOOKMARKS: "bookmarks",
};

const glassBase = "bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.4)]";

const Library = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(TABS.HISTORY);
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // MODAL STATE
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: "", message: "", onConfirm: () => {} });

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);

        if (!token) {
            setLoading(false);
            return;
        }

        const fetchLibraryData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/lib/${activeTab}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const mappedData = res.data.map((item) => ({
                    ...(item.novel || item),
                    lastReadChapter: item.lastReadChapter || null,
                    updatedAt: item.viewedAt || item.addedAt || null
                }));

                setNovels(mappedData);
            } catch (error) {
                console.error("Library sync failed", error);
                setNovels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLibraryData();
    }, [activeTab, isAuthenticated]);

    // UPDATED DELETE ROW WITH MODAL
    const handleDeleteRow = (e, novelId) => {
        e.stopPropagation();
        setModalConfig({
            title: "Purge Record",
            message: "Are you sure you want to remove this entry from your archive?",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`http://localhost:5000/api/lib/history/${novelId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNovels((prev) => prev.filter((n) => n._id !== novelId));
                    setShowModal(false);
                } catch (error) {
                    console.error("Purge failed", error);
                }
            }
        });
        setShowModal(true);
    };

    // UPDATED CLEAR HISTORY WITH MODAL
    const handleClearHistory = () => {
        setModalConfig({
            title: "Wipe Archive",
            message: "This will permanently erase all reading records from this node. Continue?",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete("http://localhost:5000/api/lib/history", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNovels([]);
                    setShowModal(false);
                } catch (error) {
                    console.error(error);
                }
            }
        });
        setShowModal(true);
    };

    return (
        <div className="relative min-h-screen w-full bg-[#030303] text-neutral-200 pt-20 px-4 md:px-8 pb-32 overflow-hidden font-sans">
            
            {/* CONFIRMATION MODAL COMPONENT */}
            <ConfirmModal 
                isOpen={showModal} 
                title={modalConfig.title} 
                message={modalConfig.message} 
                onConfirm={modalConfig.onConfirm} 
                onCancel={() => setShowModal(false)} 
            />

            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[150px] rounded-full" />

            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* --- SYSTEM HEADER --- */}
                <div className="mb-12 flex items-end justify-between border-b border-white/5 pb-8">
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                            <IoLibrary size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Archive</h1>
                            <p className="text-[10px] font-mono tracking-[0.5em] text-neutral-500 mt-1 uppercase">Node Synchronization Active</p>
                        </div>
                    </div>
                    {activeTab === TABS.HISTORY && novels.length > 0 && (
                        <button 
                            onClick={handleClearHistory} 
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-500 font-mono text-[10px] uppercase tracking-widest"
                        >
                            <IoTrashOutline size={16} /> <span className="hidden sm:inline">Wipe Node</span>
                        </button>
                    )}
                </div>

                {/* --- NAVIGATION: HORIZONTAL & RESPONSIVE --- */}
                <div className="flex items-center justify-start md:justify-center mb-16 overflow-x-auto no-scrollbar pb-2">
                    <div className="bg-white/[0.02] rounded-full p-1.5 flex items-center gap-1 border border-white/5 backdrop-blur-md">
                        {Object.entries({
                            [TABS.HISTORY]: { label: "History", icon: <FaHistory /> },
                            [TABS.FAVOURITES]: { label: "Favourites", icon: <FaHeart /> },
                            [TABS.BOOKMARKS]: { label: "Bookmarks", icon: <FaBookmark /> },
                        }).map(([key, cfg]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-6 md:px-10 py-3.5 rounded-full font-bold transition-all duration-500 text-[10px] md:text-xs tracking-[0.2em] uppercase flex-shrink-0
                                    ${activeTab === key ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] scale-105" : "text-neutral-500 hover:text-neutral-200"}`}
                            >
                                {cfg.icon} <span>{cfg.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- CONTENT LIST --- */}
                <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {!isAuthenticated ? <AuthPrompt /> : loading ? <Loading activeTab={activeTab} /> : novels.length > 0 ? (
                        novels.map((novel) => (
                            <UniversalCard 
                                key={novel._id} 
                                novel={novel} 
                                showProgress={activeTab === TABS.HISTORY}
                                onRead={() => navigate(`/novel/${novel._id}/chapter/${novel.lastReadChapter || 1}`)}
                                onDelete= {(e) => handleDeleteRow(e, novel._id)}
                            />
                        ))
                    ) : <Empty activeTab={activeTab} />}
                </div>
            </div>

            {/* Injected Styles for the scrollbar and animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

const UniversalCard = ({ novel, showProgress, onRead, onDelete }) => {
    const imageUrl = novel.coverImage?.startsWith("http") ? novel.coverImage : `http://localhost:5000${novel.coverImage}`;

    return (
        <div className={`${glassBase} group rounded-[2.5rem] p-5 flex flex-col md:flex-row items-stretch md:items-center gap-8 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-700 cursor-default relative overflow-hidden`}>
            
            {/* Visual: Image with Overlay */}
            <div className="w-full md:w-48 h-80 md:h-64 shrink-0 overflow-hidden rounded-[2rem] border border-white/10 relative shadow-2xl">
                <img 
                    src={imageUrl} 
                    alt={novel.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* row delete button */}
            {showProgress && (
                <button 
                    onClick={onDelete}
                    className="absolute top-6 right-6 p-3 rounded-2xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all z-20 opacity-0 group-hover:opacity-100"
                    title="Delete Record"
                >
                    <IoTrashOutline size={20} />
                </button>
            )}

            {/* Info: Informatics & Typography */}
            <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">Novel</span>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{novel.status || 'Active'}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter leading-none group-hover:translate-x-1 transition-transform duration-500">
                        {novel.title}
                    </h2>
                    <div className="flex items-center gap-2 text-neutral-500 mb-8">
                        <FaUserAlt size={10} className="text-blue-500/50" />
                        <span className="text-xs font-medium tracking-wide">
                            {novel.author?.username || (typeof novel.author === 'string' ? novel.author : 'Authorized Entity')}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full">
                    {showProgress && (
                        <div className="flex-1 md:flex-none flex flex-col">
                            <span className="text-[9px] font-mono text-neutral-600 uppercase mb-1 ml-1">Archive Depth</span>
                            <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-blue-400 text-xs font-black uppercase tracking-widest flex items-center justify-center">
                                Chapter {novel.lastReadChapter || 1}
                            </div>
                        </div>
                    )}
                    <div className="flex-1 md:flex-none flex flex-col">
                        <span className="text-[9px] font-mono text-neutral-600 uppercase mb-1 ml-1">&nbsp;</span>
                        <button 
                            onClick={onRead} 
                            className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-4 rounded-2xl bg-white text-black font-black uppercase text-[12px] tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all duration-500 group/btn shadow-xl shadow-white/5 active:scale-95"
                        >
                            <FaPlay size={12} className="group-hover/btn:scale-125 transition-transform" /> 
                            {showProgress ? "Resume " : "Initialize Link"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- NEW MODAL COMPONENT ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`${glassBase} w-full max-w-sm rounded-[2.5rem] p-8 text-center border-white/10 shadow-2xl animate-in zoom-in-95 duration-300`}>
                <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                    <IoTrashOutline size={30} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{title}</h2>
                <p className="text-xs text-neutral-500 mb-8 font-medium leading-relaxed px-4">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-white/5 text-neutral-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-900/20">Confirm</button>
                </div>
            </div>
        </div>
    );
};

const AuthPrompt = () => (
    <div className="flex flex-col items-center py-32 text-center animate-pulse">
        <div className="w-24 h-24 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-blue-500/20 shadow-inner">
            <FaLock size={32} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Biometric Required</h2>
        <p className="text-neutral-500 mb-10 max-w-xs font-mono text-[11px] leading-relaxed tracking-widest uppercase">Encryption active. Identify user to synchronize archive metadata.</p>
        <a href="/login" className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all">
            Unlock Terminal
        </a>
    </div>
);

const Loading = ({ activeTab }) => (
    <div className="flex flex-col items-center py-40">
        <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 border-2 border-blue-500/10 rounded-full" />
            <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.5em] text-neutral-500 uppercase">Indexing {activeTab} Records...</span>
    </div>
);

const Empty = ({ activeTab }) => (
    <div className="py-40 text-center rounded-[3rem] border border-dashed border-white/5">
        <p className="text-neutral-600 font-mono text-xs uppercase tracking-[0.4em] mb-8">Sector {activeTab} is currently void.</p>
        <a href="/novels" className="px-8 py-3 rounded-xl border border-white/10 text-neutral-500 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all">
            Scan Global Grid
        </a>
    </div>
);


export default Library;