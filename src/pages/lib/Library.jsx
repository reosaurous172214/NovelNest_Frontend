import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoLibrary, IoTrashOutline } from "react-icons/io5"; 
import { FaHistory, FaHeart, FaBookmark, FaLock, FaPlay, FaUserAlt } from "react-icons/fa";

const TABS = {
    HISTORY: "history",
    FAVOURITES: "favourites",
    BOOKMARKS: "bookmarks",
};

const glassBase = "bg-[var(--bg-secondary)] opacity-95 backdrop-blur-3xl border border-[var(--border)] shadow-2xl";

const Library = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(TABS.HISTORY);
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                const endpoint = activeTab === TABS.BOOKMARKS ? "bookmarks/get" : activeTab;
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/lib/${endpoint}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const mappedData = res.data.map((item) => ({
                    ...(item.novel || item),
                    lastReadChapter: item.lastReadChapter || null,
                    updatedAt: item.viewedAt || item.addedAt || null,
                    recordId: item._id 
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

    const handleDeleteRow = (e, novelId) => {
        e.stopPropagation();
        let deletePath = "";
        if (activeTab === TABS.HISTORY) deletePath = `history/${novelId}`;
        if (activeTab === TABS.FAVOURITES) deletePath = `favourites/${novelId}`;
        if (activeTab === TABS.BOOKMARKS) deletePath = `bookmarks/delete/${novelId}`;

        setModalConfig({
            title: "Remove Item",
            message: `Remove this from your ${activeTab}?`,
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`${process.env.REACT_APP_API_URL}/api/lib/${deletePath}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNovels((prev) => prev.filter((n) => n._id !== novelId));
                    setShowModal(false);
                } catch (error) {
                    console.error("Delete failed", error);
                }
            }
        });
        setShowModal(true);
    };

    const handleClearArchive = () => {
        const clearPath = activeTab === TABS.BOOKMARKS ? "bookmarks/clearall" : activeTab;
        setModalConfig({
            title: "Clear Library",
            message: `Delete all ${activeTab} records?`,
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`${process.env.REACT_APP_API_URL}/api/lib/${clearPath}`, {
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
        <div className="relative min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-main)] pt-32 px-4 md:px-8 pb-32 transition-colors duration-500">
            <ConfirmModal 
                isOpen={showModal} 
                title={modalConfig.title} 
                message={modalConfig.message} 
                onConfirm={modalConfig.onConfirm} 
                onCancel={() => setShowModal(false)} 
            />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-10 flex flex-col md:flex-row items-center justify-between border-b border-[var(--border)] pb-6 gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="hidden sm:flex p-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20 text-[var(--accent)]">
                            <IoLibrary size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Library</h1>
                            <p className="text-[9px] font-mono tracking-widest text-[var(--text-dim)] uppercase">Your personal collection</p>
                        </div>
                    </div>
                    {novels.length > 0 && (
                        <button 
                            onClick={handleClearArchive} 
                            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-start md:justify-center mb-12 overflow-x-auto no-scrollbar pb-2">
                    <div className="bg-[var(--bg-secondary)] rounded-full p-1.5 flex items-center gap-1 border border-[var(--border)]">
                        {Object.entries({
                            [TABS.HISTORY]: { label: "History", icon: <FaHistory /> },
                            [TABS.FAVOURITES]: { label: "Favorites", icon: <FaHeart /> },
                            [TABS.BOOKMARKS]: { label: "Bookmarks", icon: <FaBookmark /> },
                        }).map(([key, cfg]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-5 md:px-8 py-2.5 rounded-full font-bold transition-all text-[10px] md:text-xs tracking-wider uppercase whitespace-nowrap
                                    ${activeTab === key ? "bg-[var(--text-main)] text-[var(--bg-primary)] shadow-lg" : "text-[var(--text-dim)] hover:text-[var(--text-main)]"}`}
                            >
                                {cfg.icon} <span>{cfg.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    {!isAuthenticated ? <AuthPrompt /> : loading ? <Loading activeTab={activeTab} /> : novels.length > 0 ? (
                        novels.map((novel) => (
                            <UniversalCard 
                                key={novel._id} 
                                novel={novel} 
                                showDelete={true}
                                showProgress={activeTab === TABS.HISTORY}
                                onRead={() => navigate(`/novel/${novel._id}/chapter/${novel.lastReadChapter || 1}`)}
                                onDelete= {(e) => handleDeleteRow(e, novel._id)}
                            />
                        ))
                    ) : <Empty activeTab={activeTab} />}
                </div>
            </div>
        </div>
    );
};

const UniversalCard = ({ novel, showProgress, showDelete, onRead, onDelete }) => {
    const imageUrl = novel.coverImage?.startsWith("http") ? novel.coverImage : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

    return (
        <div className={`${glassBase} group rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 hover:border-[var(--accent)]/50 transition-all duration-300 relative overflow-hidden text-left w-full max-w-full lg:max-w-3xl`}>
            
            {/* Responsive Image: Full width on mobile, fixed width on desktop */}
            <div className="w-full md:w-36 h-64 md:h-48 shrink-0 overflow-hidden rounded-[1.5rem] border border-[var(--border)] relative shadow-xl">
                <img 
                    src={imageUrl} 
                    alt={novel.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
            </div>

            {showDelete && (
                <button 
                    onClick={onDelete}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all z-20"
                >
                    <IoTrashOutline size={18} />
                </button>
            )}

            <div className="flex-1 flex flex-col w-full">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[8px] font-black text-[var(--accent)] uppercase tracking-widest bg-[var(--accent)]/10 px-2 py-0.5 rounded border border-[var(--accent)]/20">Novel</span>
                        <span className="text-[8px] font-mono text-[var(--text-dim)] uppercase">{novel.status || 'Active'}</span>
                    </div>
                    <h2 className="text-xl md:text-3xl font-black text-[var(--text-main)] mb-1 tracking-tight uppercase italic">
                        {novel.title}
                    </h2>
                    <div className="flex items-center gap-2 text-[var(--text-dim)]">
                        <FaUserAlt size={8} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            {novel.author?.username || 'Author'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                    {showProgress ? (
                        <div className="flex flex-col">
                            <span className="text-[8px] font-bold text-[var(--text-dim)] uppercase mb-1">Last Read</span>
                            <div className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--accent)] text-[10px] font-black uppercase">
                                Chapter {novel.lastReadChapter || 1}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-[8px] font-bold text-[var(--text-dim)] uppercase mb-1">Added On</span>
                            <span className="text-[10px] font-mono text-[var(--text-dim)]">
                                {novel.updatedAt ? new Date(novel.updatedAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    )}
                    
                    <button 
                        onClick={onRead} 
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 rounded-xl bg-[var(--accent)] text-white font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95"
                    >
                        <FaPlay size={8} /> 
                        {showProgress ? "Continue" : "Read Now"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[var(--bg-secondary)] w-full max-w-sm rounded-[2.5rem] p-8 md:p-10 text-center border border-[var(--border)] shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                    <IoTrashOutline size={28} />
                </div>
                <h2 className="text-2xl font-black uppercase italic mb-3 text-[var(--text-main)]">{title}</h2>
                <p className="text-xs text-[var(--text-dim)] mb-8 font-medium leading-relaxed">{message}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={onCancel} className="w-full py-4 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-main)] font-bold text-[10px] uppercase border border-[var(--border)] hover:bg-white/5 transition-all">Cancel</button>
                    <button onClick={onConfirm} className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-[10px] uppercase hover:bg-red-500 transition-all shadow-lg shadow-red-900/20">Delete</button>
                </div>
            </div>
        </div>
    );
};

const AuthPrompt = () => (
    <div className="flex flex-col items-center py-20 text-center">
        <FaLock size={30} className="text-[var(--accent)] mb-6 opacity-30" />
        <h2 className="text-2xl font-black uppercase mb-2">Login Required</h2>
        <p className="text-[var(--text-dim)] mb-8 text-[10px] font-bold uppercase tracking-widest">Please log in to view your collection.</p>
        <a href="/login" className="px-10 py-4 rounded-xl bg-[var(--accent)] text-white font-black uppercase text-[10px] tracking-widest">Login</a>
    </div>
);

const Loading = ({ activeTab }) => (
    <div className="flex flex-col items-center py-20 text-center">
        <div className="w-8 h-8 border-4 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-black tracking-widest text-[var(--text-dim)] uppercase">Loading {activeTab}...</span>
    </div>
);

const Empty = ({ activeTab }) => (
    <div className="py-20 px-6 text-center rounded-[2.5rem] border border-dashed border-[var(--border)] bg-[var(--bg-secondary)]/30 w-full">
        <p className="text-[var(--text-dim)] font-black text-[10px] uppercase tracking-widest mb-8 italic">Your {activeTab} is empty.</p>
        <a href="/novels" className="px-8 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all">Browse Novels</a>
    </div>
);

export default Library;