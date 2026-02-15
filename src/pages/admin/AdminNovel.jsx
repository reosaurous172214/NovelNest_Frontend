import { useEffect, useState, useCallback } from "react";
import { 
  LuTrash2, LuFilePenLine, LuExternalLink, LuTriangleAlert, 
  LuSearch, LuBookOpen, LuBook, LuRefreshCw
} from "react-icons/lu";
import { fetchAllNovels, deleteNovel } from "../../api/apiAdmin.js";
import { useAlert } from "../../context/AlertContext.jsx";
import NovelDrawer from "../../components/admin/NovelDrawer.jsx";
import NovelEdit from "../../components/admin/NovelEdit.jsx";

export default function AdminNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerNovel, setDrawerNovel] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editNovel, setEditNovel] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const { showAlert } = useAlert();

  const loadNovels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllNovels();
      setNovels(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert("Failed to sync records", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadNovels();
  }, [loadNovels]);

  const handleOpenDrawer = (novel) => {
    setDrawerNovel(novel);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (novel) => {
    setEditNovel(novel);
    setIsEditOpen(true);
  };

  const confirmDelete = (novel) => {
    setSelectedNovel(novel);
    setIsModalOpen(true);
  };

  const deleteHandler = async () => {
    if (!selectedNovel) return;
    try {
      const success = await deleteNovel(selectedNovel._id, "Policy Violation / Admin Action");
      if (success) {
        setNovels((prev) => prev.filter((n) => n._id !== selectedNovel._id));
        showAlert("Record removed successfully", "success");
        setIsModalOpen(false);
        setSelectedNovel(null);
      }
    } catch (err) {
      showAlert("System error during removal", "error");
    }
  };

  const filteredNovels = novels.filter((novel) =>
    novel.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCoverPic = (novel) => {
    const hasCover = novel.coverImage && typeof novel.coverImage === 'string';
    const isExternal = hasCover && novel.coverImage.startsWith('http');
    const imgSrc = isExternal ? novel.coverImage : `${process.env.REACT_APP_API_URL}${novel.coverImage}`;

    return (
      <div className="w-16 h-24 md:w-20 md:h-28 rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-primary)] flex-shrink-0 flex items-center justify-center">
        {hasCover ? (
          <img 
            src={imgSrc} 
            alt="" 
            className="w-full h-full object-cover" 
            onError={(e) => { 
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }} 
          />
        ) : null}
        <div className={`${hasCover ? 'hidden' : 'flex'} items-center justify-center text-[var(--text-dim)]`}>
          <LuBook size={24} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 bg-[var(--bg-primary)] min-h-screen font-sans text-[var(--text-main)] text-left">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-main)]">Content Ledger</h1>
          <p className="text-[var(--text-dim)] text-sm">Official directory of all hosted stories.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button onClick={loadNovels} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-dim)] hover:text-[var(--accent)] transition-all">
            <LuRefreshCw className={loading ? "animate-spin" : ""} size={18} />
          </button>
          <div className="relative flex-grow sm:flex-grow-0">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 text-sm outline-none text-[var(--text-main)]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4">
        {loading && novels.length === 0 ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[var(--bg-secondary)] rounded-2xl animate-pulse" />
          ))
        ) : filteredNovels.length > 0 ? (
          filteredNovels.map((novel) => (
            <div key={novel._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)]/50 transition-all gap-4">
              {/* Added min-w-0 to the parent container to allow children to truncate/clamp */}
              <div className="flex items-start sm:items-center gap-4 md:gap-6 min-w-0 flex-1">
                {renderCoverPic(novel)}
                <div className="min-w-0 flex-1">
                  {/* line-clamp-2 prevents the title from ever exploding the layout height */}
                  <h3 className="text-base md:text-lg font-semibold text-[var(--text-main)] leading-tight line-clamp-1 md:line-clamp-2">
                    {novel.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-2">
                    <span className="text-[10px] md:text-xs text-[var(--text-dim)] font-medium">Author: <span className="text-[var(--text-main)]">{novel.author?.username || "Anonymous"}</span></span>
                    <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-[var(--text-dim)] font-medium">
                      <LuBookOpen size={14} className="text-[var(--accent)]" /> {novel.totalChapters || 0}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] md:text-[10px] font-semibold uppercase border ${novel.isPublished ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : "text-[var(--text-dim)] border-[var(--border)]"}`}>
                      {novel.isPublished ? "Active" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleOpenDrawer(novel)} className="flex items-center justify-center p-3 bg-[var(--bg-primary)] text-[var(--text-dim)] hover:text-[var(--accent)] rounded-xl border border-[var(--border)]"><LuExternalLink size={18} /></button>
                <button onClick={() => handleOpenEdit(novel)} className="flex items-center justify-center p-3 bg-[var(--bg-primary)] text-[var(--text-dim)] hover:text-blue-500 rounded-xl border border-[var(--border)]"><LuFilePenLine size={18} /></button>
                <button onClick={() => confirmDelete(novel)} className="flex items-center justify-center p-3 bg-[var(--bg-primary)] text-[var(--text-dim)] hover:text-red-500 rounded-xl border border-[var(--border)]"><LuTrash2 size={18} /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-30 uppercase tracking-widest text-xs font-semibold">No Records Found</div>
        )}
      </div>

      <NovelDrawer novel={drawerNovel} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <NovelEdit novel={editNovel} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-2xl shadow-2xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-4 mb-6 text-left">
              <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl"><LuTriangleAlert size={24} /></div>
              <div><h3 className="text-lg font-semibold">Remove Record</h3><p className="text-[10px] text-[var(--text-dim)] uppercase font-semibold">Action Required</p></div>
            </div>
            <p className="text-sm text-[var(--text-dim)] mb-6 text-left">Confirming removal of <span className="font-semibold text-[var(--text-main)]">"{selectedNovel?.title}"</span>.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase text-[var(--text-dim)]">Cancel</button>
              <button onClick={deleteHandler} className="flex-1 px-4 py-2.5 bg-red-600 text-white text-xs font-semibold uppercase rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}