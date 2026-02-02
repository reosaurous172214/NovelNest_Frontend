import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; 
import {
  FaPlus, FaSave, FaTrash, FaEdit, FaChevronLeft, 
  FaCloudUploadAlt, FaFeatherAlt, FaLayerGroup, FaHistory, FaTimes
} from "react-icons/fa";
import { useAlert } from "../../context/AlertContext";

export default function EditNovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // For Modal

  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const mdeOptions = useMemo(() => ({
    autofocus: false,
    spellChecker: false,
    placeholder: "Write your masterpiece...",
    status: ["words", "lines"],
    minHeight: "400px",
    toolbar: [
      "bold", "italic", "heading", "|", 
      "quote", "unordered-list", "ordered-list", "|", 
      "preview", "side-by-side", "fullscreen", "|", 
      "guide"
    ],
  }), []);

  useEffect(() => { fetchNovel(); }, [id]);

  // Auto-save logic
  useEffect(() => {
    if (!editingId || !title.trim() || !content.trim()) return;
    const delayDebounceFn = setTimeout(() => { handleAutoSave(); }, 3000);
    return () => clearTimeout(delayDebounceFn);
  }, [title, content]);

  const fetchNovel = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/novels/${id}`, authConfig);
      setNovel(res.data);
      const chapRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/novel/${id}`);
      const rawData = Array.isArray(chapRes.data) ? chapRes.data : chapRes.data.chapters || [];
      setChapters([...rawData].sort((a, b) => b.chapterNumber - a.chapterNumber));
    } catch (err) {
      showAlert("Sync error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    setAutoSaving(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/chapters/${editingId}`, { title, content }, authConfig);
      setChapters(prev => prev.map(ch => ch._id === editingId ? { ...ch, title, content } : ch));
    } catch (err) {
      console.error("Auto-save failed");
    } finally {
      setTimeout(() => setAutoSaving(false), 800);
    }
  };

  const addOrUpdateChapter = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/chapters/${editingId}`, { title, content }, authConfig);
        showAlert("Chapter Updated", "success");
        setChapters(prev => prev.map(ch => ch._id === editingId ? { ...ch, title, content } : ch));
      } else {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chapters`, { novelId: id, title, content }, authConfig);
        showAlert("Published!", "success");
        // Update local list with the new chapter (assuming backend returns the new chapter object)
        const newChapter = res.data.chapter || res.data;
        setChapters([newChapter, ...chapters]);
      }
      resetForm();
    } catch (err) {
      showAlert("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteChapter = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chapters/${deletingId}`, authConfig);
      setChapters(prev => prev.filter(ch => ch._id !== deletingId));
      if (editingId === deletingId) resetForm();
      showAlert("Chapter removed", "success");
    } catch (err) {
      showAlert("Deletion failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--accent)] font-mono text-xs uppercase tracking-widest">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        Loading Manuscript
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-20 selection:bg-[var(--accent)]">
      
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[var(--bg-secondary)] border border-red-500/20 p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaTrash size={20} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-center text-white">Discard Chapter?</h3>
            <p className="text-[var(--text-dim)] text-center text-sm mb-8">This will permanently delete this chapter from the database. This action is irreversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all">Cancel</button>
              <button onClick={deleteChapter} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HERO HEADER --- */}
      <div className="relative h-44 w-full border-b border-[var(--border)] overflow-hidden">
        <img 
          src={novel?.coverImage} 
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-10 scale-110" 
          alt="" 
        />
        <div className="relative max-w-6xl mx-auto px-6 h-full flex items-center gap-6">
          <img 
            src={novel?.coverImage} 
            className="w-20 h-28 rounded-md shadow-2xl object-cover border border-white/10" 
            alt="cover" 
          />
          <div className="flex-1">
            <Link to="/dashboard" className="text-[10px] uppercase font-bold text-[var(--accent)] mb-1 flex items-center gap-1 hover:brightness-125 transition-all">
              <FaChevronLeft size={8} /> My Library
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{novel?.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {novel?.status}
              </span>
              <span className="text-[10px] text-[var(--text-dim)] font-medium">
                {chapters.length} Chapters Created
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- WRITING AREA --- */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-xl p-6">
              
              <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-3 text-[var(--text-dim)]">
                  <FaFeatherAlt className="text-[var(--accent)]" size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {editingId ? "Edit Manuscript" : "New Entry"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                    {autoSaving && (
                    <div className="text-[9px] text-[var(--accent)] font-bold flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/5 rounded-full">
                        <FaCloudUploadAlt className="animate-bounce" /> SYNCING
                    </div>
                    )}
                    {editingId && (
                        <button onClick={resetForm} className="text-[var(--text-dim)] hover:text-white">
                            <FaTimes size={14} />
                        </button>
                    )}
                </div>
              </div>

              <div className="space-y-6 mde-container">
                <input
                  type="text"
                  placeholder="Chapter Title..."
                  className="w-full bg-transparent border-b border-transparent focus:border-[var(--accent)] pb-2 text-xl font-bold outline-none transition-all placeholder:opacity-30"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <SimpleMDE
                  value={content}
                  onChange={(val) => setContent(val)}
                  options={mdeOptions}
                />
                
                <div className="flex gap-4">
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="px-6 py-4 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
                    >
                      New Chapter
                    </button>
                  )}
                  <button
                    disabled={saving || !title.trim() || !content.trim()}
                    onClick={addOrUpdateChapter}
                    className="flex-1 py-4 bg-[var(--accent)] text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
                  >
                    {saving ? "Processing..." : editingId ? <><FaSave /> Commit Changes</> : <><FaPlus /> Publish Now</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- SIDEBAR INDEX --- */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--bg-primary)] rounded-lg text-[var(--accent)]/50">
                    <FaLayerGroup size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-widest">Total Volume</p>
                    <p className="text-xl font-bold">{chapters.length} Chapters</p>
                  </div>
               </div>
            </div>

            <div className="px-2 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-[0.2em]">Table of Contents</h3>
              <button 
                onClick={resetForm}
                className="p-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded hover:bg-[var(--accent)] hover:text-white transition-all"
                title="Create New Chapter"
              >
                <FaPlus size={10} />
              </button>
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto no-scrollbar pr-1">
              {chapters.length === 0 && (
                <div className="py-10 text-center border border-dashed border-[var(--border)] rounded-xl opacity-30">
                  <p className="text-[9px] font-bold uppercase tracking-widest">No Manuscripts Found</p>
                </div>
              )}
              {chapters.map((ch) => (
                <div 
                  key={ch._id} 
                  onClick={() => { 
                    setTitle(ch.title); 
                    setContent(ch.content); 
                    setEditingId(ch._id); 
                    window.scrollTo({top: 100, behavior: 'smooth'}); 
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
                    editingId === ch._id 
                      ? "bg-[var(--bg-primary)] border-[var(--accent)] shadow-md translate-x-1" 
                      : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--bg-primary)]"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="truncate pr-4">
                      <p className="text-[8px] font-bold text-[var(--accent)] uppercase mb-0.5">Chapter {ch.chapterNumber || '?'}</p>
                      <h4 className="text-[13px] font-bold truncate uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors">
                        {ch.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setDeletingId(ch._id); 
                            }}
                            className="p-2 text-red-500/0 group-hover:text-red-500/40 hover:!text-red-500 transition-all"
                        >
                            <FaTrash size={10} />
                        </button>
                        <FaEdit size={10} className={`transition-opacity ${editingId === ch._id ? "opacity-100 text-[var(--accent)]" : "opacity-0 group-hover:opacity-40"}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}