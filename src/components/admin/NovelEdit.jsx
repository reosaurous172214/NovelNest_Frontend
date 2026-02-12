import React, { useState, useEffect } from "react";
import { 
  LuX, LuBook, LuUser, LuAlignLeft, LuSave, LuLoader, 
  LuCircleCheck, LuTags, LuListOrdered, LuTrash2, LuPlus 
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { getHeaders } from "../../getItems/getAuthItems";
export default function NovelEdit({ novel, isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    genres: [],
    chapters: [] 
  });
  const [newGenre, setNewGenre] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (novel && isOpen) {
      setFormData({
        title: novel.title || "",
        description: novel.description || "",
        genres: novel.genres || [],
        chapters: novel.totalChapters || [] // Assuming backend populates this
      });
      setStatus("idle");
    }
  }, [novel, isOpen]);

  if (!novel) return null;

  // Genre Handlers
  const addGenre = () => {
    if (newGenre && !formData.genres.includes(newGenre)) {
      setFormData({ ...formData, genres: [...formData.genres, newGenre] });
      setNewGenre("");
    }
  };

  const removeGenre = (target) => {
    setFormData({ ...formData, genres: formData.genres.filter(g => g !== target) });
  };

  // Chapter Handlers (Simulated deletion/management)
  const removeChapter = (id) => {
    setFormData({ ...formData, chapters: formData.chapters.filter(c => c._id !== id) });
  };

  const handleAction = async () => {
    if (status === "saving") return;
    setStatus("saving");
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/novels/${novel._id}`, 
        formData,
        getHeaders(),
        { withCredentials: true }
      );

      if (response.status === 200) {
        setStatus("success");
        if (onRefresh) onRefresh(); 
        setTimeout(() => onClose(), 600);
      }
    } catch (err) {
      console.error("Sync Error:", err);
      setStatus("error");
    }
  };

  const fastTransition = { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.2 };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={fastTransition}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-2 text-[var(--text-main)] font-bold text-xs uppercase tracking-widest">
                <LuBook className="text-[var(--accent)]" size={18} /> Global Registry Editor
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--border)] rounded-full text-[var(--text-dim)] transition-colors">
                <LuX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* 1. Basic Metadata */}
              <section className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2">
                    <LuUser size={12}/> Novel Title
                  </label>
                  <input 
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-main)] focus:border-[var(--accent)] outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2">
                    <LuAlignLeft size={12}/> Synopsis
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text-dim)] focus:border-[var(--accent)] outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </section>

              {/* 2. Taxonomy (Genres) */}
              <section className="space-y-3">
                <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2">
                  <LuTags size={12}/> Taxonomy Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.genres.map(g => (
                    <span key={g} className="flex items-center gap-1 px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded text-[10px] font-bold uppercase">
                      {g}
                      <LuX size={10} className="cursor-pointer hover:text-red-500" onClick={() => removeGenre(g)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-main)] outline-none"
                    placeholder="Add new genre..."
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGenre()}
                  />
                  <button onClick={addGenre} className="p-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--accent)] hover:bg-[var(--border)]">
                    <LuPlus size={16} />
                  </button>
                </div>
              </section>

              {/* 3. Chapter Registry */}
              <section className="space-y-3">
                <label className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2">
                  <LuListOrdered size={12}/> Chapter Index ({formData.chapters.length})
                </label>
                <div className="space-y-2">
                  {formData.chapters.length > 0 ? formData.chapters.map((ch, idx) => (
                    <div key={ch._id || idx} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg group">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-[var(--accent)]">CH {idx + 1}</span>
                        <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-[200px]">{ch.title}</span>
                      </div>
                      <button 
                        onClick={() => removeChapter(ch._id)}
                        className="p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  )) : (
                    <p className="text-xs text-[var(--text-dim)] italic">No chapters found in registry.</p>
                  )}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-primary)]">
               <button 
                 onClick={handleAction}
                 disabled={status === "saving"}
                 className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-lg transition-all shadow-lg active:scale-[0.98] 
                  ${status === "success" ? "bg-green-600 text-white" : "bg-[var(--accent)] text-white hover:brightness-110 shadow-[var(--accent)]/20"}`}
               >
                 {status === "saving" ? <LuLoader className="animate-spin" size={20} /> : 
                  status === "success" ? <LuCircleCheck size={20} /> : <LuSave size={18} />}
                 {status === "saving" ? "Syncing Registry..." : status === "success" ? "Registry Updated" : "Commit Changes"}
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}