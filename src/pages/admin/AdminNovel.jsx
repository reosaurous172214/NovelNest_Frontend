import { useEffect, useState } from "react";
import { 
  LuTrash2, 
  LuFilePenLine, 
  LuExternalLink, 
  LuTriangleAlert, 
  LuSearch, 
  LuBookOpen, 
  LuFilter,
  LuBook
} from "react-icons/lu";
import { fetchAllNovels, deleteNovel } from "../../api/apiAdmin.js";
import { useAlert } from "../../context/AlertContext.jsx";
import NovelDrawer from "../../components/admin/NovelDrawer.jsx";

export default function AdminNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sidebar Panel State
  const [drawerNovel, setDrawerNovel] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Confirmation Box State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    loadNovels();
  }, []);

  const loadNovels = async () => {
    try {
      setLoading(true);
      const data = await fetchAllNovels();
      setNovels(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert("Failed to sync records", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = (novel) => {
    setDrawerNovel(novel);
    setIsDrawerOpen(true);
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
    const imgSrc = isExternal ? novel.coverImage : `${process.env.REACT_APP_API_URL}/${novel.coverImage}`;

    return (
      <div className="w-10 h-14 rounded border border-[var(--border)] overflow-hidden bg-[var(--bg-primary)] flex-shrink-0 flex items-center justify-center">
        {hasCover ? (
          <img 
            src={imgSrc} 
            alt="" 
            className="w-full h-full object-cover" 
            onError={(e) => { 
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} 
          />
        ) : null}
        <div className={`${hasCover ? 'hidden' : 'flex'} items-center justify-center text-[var(--text-dim)]`}>
          <LuBook size={20} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-[var(--bg-primary)] min-h-screen font-sans text-[var(--text-main)]">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Content Ledger</h1>
          <p className="text-[var(--text-dim)] text-sm">Official directory of all hosted stories and titles.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] outline-none transition-all shadow-sm text-[var(--text-main)]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text-main)] shadow-sm transition-all">
            <LuFilter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-wider text-[var(--text-dim)]">Title & Identity</th>
                <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-wider text-[var(--text-dim)]">Author</th>
                <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-wider text-[var(--text-dim)]">Chapters</th>
                <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-wider text-[var(--text-dim)]">Status</th>
                <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-wider text-[var(--text-dim)] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-8"><div className="h-10 bg-[var(--bg-primary)] rounded-lg w-full"></div></td>
                  </tr>
                ))
              ) : filteredNovels.length > 0 ? (
                filteredNovels.map((novel) => (
                  <tr key={novel._id} className="hover:bg-[var(--bg-primary)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {renderCoverPic(novel)}
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                            {novel.title}
                          </div>
                          <div className="text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-tighter mt-0.5">ID: {novel._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[var(--text-dim)] font-medium">
                        {novel.author?.username || "Anonymous"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[var(--text-main)] font-mono">
                        <LuBookOpen size={14} className="text-[var(--text-dim)]" />
                        {novel.totalChapters || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${
                        novel.isPublished 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-[var(--bg-primary)] text-[var(--text-dim)] border-[var(--border)]"
                      }`}>
                        {novel.isPublished ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleOpenDrawer(novel)}
                          className="p-2 text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-[var(--bg-primary)] rounded-lg transition-all"
                          title="View Details"
                        >
                          <LuExternalLink size={16} />
                        </button>
                        <button className="p-2 text-[var(--text-dim)] hover:text-blue-500 hover:bg-[var(--bg-primary)] rounded-lg transition-all">
                          <LuFilePenLine size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(novel)}
                          className="p-2 text-[var(--text-dim)] hover:text-red-500 hover:bg-[var(--bg-primary)] rounded-lg transition-all"
                        >
                          <LuTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-[var(--text-dim)]">
                    No records found in current view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE INFORMATION PANEL */}
      <NovelDrawer 
        novel={drawerNovel} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* REMOVAL CONFIRMATION BOX */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-2xl shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                  <LuTriangleAlert size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-main)]">Remove Record</h3>
                  <p className="text-xs text-[var(--text-dim)] uppercase tracking-widest font-bold">Action required</p>
                </div>
              </div>

              <p className="text-sm text-[var(--text-dim)] mb-6 leading-relaxed">
                You are about to permanently remove <span className="font-bold text-[var(--text-main)]">"{selectedNovel?.title}"</span>. 
                This will clear all details and chapters from the system.
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-primary)] border-t border-[var(--border)] flex gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteHandler}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}