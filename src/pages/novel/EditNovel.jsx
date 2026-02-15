import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; 
import {
  LuPlus, LuSave, LuTrash, LuChevronLeft, 
  LuCircleCheck, LuLoader, LuFileCog, LuLayers, LuBookOpen, LuX
} from "react-icons/lu";
import { useAlert } from "../../context/AlertContext";
import { getHeaders } from "../../getItems/getAuthItems";

export default function EditNovel() {
  const { id } = useParams();
  const { showAlert } = useAlert();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // STATE RESTORED

  const mdeOptions = useMemo(() => ({
    autofocus: false,
    spellChecker: false,
    placeholder: "Begin writing...",
    status: ["words"],
    minHeight: "400px", 
    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "|", "preview", "side-by-side", "fullscreen"],
  }), []);

  const fetchNovel = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/novels/${id}`, getHeaders());
      setNovel(res.data);
      const chapRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/chapters/novel/${id}`);
      const rawData = Array.isArray(chapRes.data) ? chapRes.data : chapRes.data.chapters || [];
      setChapters([...rawData].sort((a, b) => b.chapterNumber - a.chapterNumber));
    } catch (err) {
      showAlert("Sync error", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showAlert]);

  useEffect(() => { fetchNovel(); }, [fetchNovel]);

  const handleAutoSave = useCallback(async () => {
    if (!editingId) return;
    setAutoSaving(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/chapters/${editingId}`, { title, content }, getHeaders());
      setChapters(prev => prev.map(ch => ch._id === editingId ? { ...ch, title, content } : ch));
    } catch (err) {
      console.error("Auto-save failed");
    } finally {
      setTimeout(() => setAutoSaving(false), 800);
    }
  }, [editingId, title, content]);

  useEffect(() => {
    if (!editingId || !title?.trim() || !content?.trim()) return;
    const timeout = setTimeout(() => handleAutoSave(), 5000);
    return () => clearTimeout(timeout);
  }, [title, content, editingId, handleAutoSave]);

  const addOrUpdateChapter = async () => {
    if (!title.trim() || !content.trim()) return showAlert("Fields required", "error");
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/chapters/${editingId}`, { title, content }, getHeaders());
        setChapters(prev => prev.map(ch => ch._id === editingId ? { ...ch, title, content } : ch));
        showAlert("Novel Registry Updated", "success");
      } else {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chapters`, { novelId: id, title, content }, getHeaders());
        const newChapter = res.data.chapter || res.data;
        setChapters([newChapter, ...chapters]);
        showAlert("Chapter Published", "success");
      }
      resetForm();
    } catch (err) {
      showAlert("Save failure", "error");
    } finally {
      setSaving(false);
    }
  };

  // RESTORED DELETE LOGIC
  const deleteChapter = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chapters/${deletingId}`, getHeaders());
      setChapters(prev => prev.filter(ch => ch._id !== deletingId));
      if (editingId === deletingId) resetForm();
      showAlert("Chapter removed", "success");
    } catch (err) {
      showAlert("Error deleting", "error");
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <LuLoader className="w-6 h-6 text-[var(--accent)] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-20 pb-12 font-sans selection:bg-[var(--accent)]/20">
      
      {/* RESTORED DELETE MODAL JSX */}
      {deletingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-8 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-center">Discard Chapter?</h3>
            <p className="text-[var(--text-dim)] text-center text-sm mb-8 leading-relaxed">This will remove the entry from the registry permanently.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-[var(--bg-primary)] rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all hover:bg-[var(--border)]">Cancel</button>
              <button onClick={deleteChapter} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-red-500/20 active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="relative h-40 w-full border-b border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]">
        <div className="relative max-w-6xl mx-auto px-6 h-full flex items-end pb-6 gap-6">
          <img src={novel?.coverImage} className="w-16 h-24 rounded-lg shadow-lg object-cover border border-[var(--border)] hidden sm:block" alt="" />
          <div className="flex-1">
            <Link to="/author/my-uploads" className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--accent)] mb-1 hover:underline">
              <LuChevronLeft size={12} /> Novel Studio
            </Link>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{novel?.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[9px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded font-bold uppercase">{novel?.status}</span>
              <span className="text-[11px] text-[var(--text-dim)] font-medium flex items-center gap-1.5"><LuLayers size={14}/> {chapters.length} Chapters</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* --- EDITOR --- */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <LuFileCog size={16} className="text-[var(--text-dim)]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">
                    {editingId ? "Modify Volume" : "Draft New Entry"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {autoSaving && <div className="text-[8px] text-[var(--accent)] font-bold flex items-center gap-1.5 px-2 py-1 bg-[var(--accent)]/5 rounded-md border border-[var(--accent)]/10">
                    <LuCircleCheck size={12} className="animate-pulse" /> SYNCING
                  </div>}
                  {editingId && <button onClick={resetForm} className="p-1.5 text-[var(--text-dim)] hover:text-white transition-colors"><LuX size={18} /></button>}
                </div>
              </div>

              <input
                type="text"
                placeholder="Chapter Title..."
                className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] pb-3 mb-6 text-xl font-bold outline-none transition-all placeholder:opacity-20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] shadow-inner" style={{ height: '500px' }}>
                <div className="w-full h-full overflow-y-auto no-scrollbar editor-wrapper prose-invert">
                  <SimpleMDE value={content} onChange={(val) => setContent(val)} options={mdeOptions} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
              </div>
              
              <div className="flex gap-3 mt-6">
                {editingId && <button onClick={resetForm} className="px-6 py-3 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] rounded-xl font-bold text-[10px] uppercase tracking-wider hover:text-white transition-all">New Draft</button>}
                <button
                  disabled={saving || !title?.trim() || !content?.trim()}
                  onClick={addOrUpdateChapter}
                  className="flex-1 py-3 bg-[var(--accent)] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-20"
                >
                  {saving ? <LuLoader className="animate-spin" size={16}/> : editingId ? <LuSave size={16}/> : <LuPlus size={16}/>}
                  {saving ? "Processing..." : editingId ? "Save Changes" : "Publish to Library"}
                </button>
              </div>
            </div>
          </div>

          {/* --- SIDEBAR --- */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[var(--text-dim)]">
                <LuBookOpen size={14}/>
                <h3 className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest">Chapters</h3>
              </div>
              <button onClick={resetForm} className="p-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-white transition-all">
                <LuPlus size={14} />
              </button>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto no-scrollbar pr-1">
              {chapters.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-[var(--border)] rounded-xl opacity-30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)]">Empty Archive</p>
                </div>
              ) : (
                chapters.map((ch) => (
                  <div 
                    key={ch._id} 
                    onClick={() => { setTitle(ch.title); setContent(ch.content); setEditingId(ch._id); }}
                    className={`group p-4 rounded-xl border cursor-pointer transition-all ${editingId === ch._id ? "bg-[var(--bg-secondary)] border-[var(--accent)] shadow-md translate-x-1" : "bg-[var(--bg-primary)] border-[var(--border)] hover:border-[var(--accent)]/30"}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 truncate pr-3">
                        <span className="text-[8px] font-bold text-[var(--accent)] uppercase mb-0.5 block">Volume {ch.chapterNumber}</span>
                        <h4 className="text-xs font-bold truncate group-hover:text-[var(--accent)] transition-colors">{ch.title}</h4>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setDeletingId(ch._id); }} className="p-1.5 text-red-500/0 group-hover:text-red-500/20 hover:!text-red-500 transition-all">
                        <LuTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-sm">
               <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-1">Chapter Statistics</p>
               <p className="text-sm font-bold">{chapters.reduce((acc, curr) => acc + (curr.content?.split(' ').length || 0), 0).toLocaleString()} Words</p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        .editor-wrapper .editor-toolbar { border: none; background: var(--bg-secondary); border-bottom: 1px solid var(--border); padding: 8px; }
        .editor-wrapper .CodeMirror { border: none; background: transparent; font-size: 0.95rem; line-height: 1.6; color: var(--text-main); padding: 12px; }
      `}</style>
    </div>
  );
}