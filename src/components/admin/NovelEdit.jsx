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
        chapters: novel.totalChapters || []
      });
      setStatus("idle");
    }
  }, [novel, isOpen]);

  if (!novel) return null;

  const addGenre = () => {
    if (newGenre && !formData.genres.includes(newGenre)) {
      setFormData({ ...formData, genres: [...formData.genres, newGenre] });
      setNewGenre("");
    }
  };

  const removeGenre = (target) => {
    setFormData({ ...formData, genres: formData.genres.filter(g => g !== target) });
  };

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
        getHeaders()
      );

      if (response.status === 200) {
        setStatus("success");
        if (onRefresh) onRefresh(); 
        setTimeout(() => onClose(), 600);
      }
    } catch (err) {
      setStatus("error");
    }
  };

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
            transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.25 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border)] shadow-2xl flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-2 text-[var(--text-main)] font-semibold text-xs uppercase tracking-wider">
                <LuBook className="text-[var(--accent)]" size={18} /> Edit Story
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--border)] rounded-full text-[var(--text-dim)] transition-colors">
                <LuX size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-2 pl-1">
                  <LuUser size={12}/> Story Title
                </label>
                <input 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:border-[var(--accent)] outline-none text-sm font-medium transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Synopsis Input - FIXED BOX */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-2 pl-1">
                  <LuAlignLeft size={12}/> Synopsis
                </label>
                
                {/* PHYSICAL CONTAINER LOCK */}
                <div 
                  className="relative w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden transition-all focus-within:border-[var(--accent)]"
                  style={{ height: '160px' }} 
                >
                  <textarea 
                    className="w-full h-full bg-transparent px-4 py-3 text-sm text-[var(--text-main)] outline-none resize-none overflow-y-auto no-scrollbar font-medium leading-relaxed"
                    value={formData.description}
                    placeholder="Enter story description..."
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                  {/* Subtle fade effect at bottom for aesthetic flow */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Genres Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-2 pl-1">
                  <LuTags size={12}/> Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map(g => (
                    <span key={g} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)]/5 text-[var(--accent)] border border-[var(--accent)]/10 rounded-lg text-[10px] font-bold uppercase transition-all hover:bg-[var(--accent)]/10">
                      {g}
                      <LuX size={10} className="cursor-pointer hover:text-red-500" onClick={() => removeGenre(g)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent)] transition-all font-medium"
                    placeholder="Add a genre..."
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGenre()}
                  />
                  <button onClick={addGenre} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--accent)] hover:bg-[var(--border)] transition-all">
                    <LuPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                <label className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-2 pl-1">
                  <LuListOrdered size={12}/> Chapters ({formData.chapters.length})
                </label>
                <div className="space-y-2.5">
                  {formData.chapters.length > 0 ? formData.chapters.map((ch, idx) => (
                    <div key={ch._id || idx} className="flex items-center justify-between p-3.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl group hover:border-[var(--accent)]/30 transition-all">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-[var(--accent)] opacity-60 uppercase">Ch {idx + 1}</span>
                        <span className="text-xs font-semibold text-[var(--text-main)] truncate max-w-[200px]">{ch.title}</span>
                      </div>
                      <button onClick={() => removeChapter(ch._id)} className="p-2 text-[var(--text-dim)] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                        <LuTrash2 size={15} />
                      </button>
                    </div>
                  )) : <p className="text-xs text-[var(--text-dim)] italic pl-1">No content recorded.</p>}
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex-shrink-0 p-6 border-t border-[var(--border)] bg-[var(--bg-primary)]">
               <button 
                 onClick={handleAction}
                 disabled={status === "saving"}
                 className={`w-full flex items-center justify-center gap-3 py-4 font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] text-sm
                  ${status === "success" ? "bg-emerald-600 text-white" : "bg-[var(--accent)] text-white hover:brightness-105 shadow-[var(--accent)]/20"}`}
               >
                 {status === "saving" ? <LuLoader className="animate-spin" size={18} /> : 
                  status === "success" ? <LuCircleCheck size={18} /> : <LuSave size={18} />}
                 {status === "saving" ? "Saving..." : status === "success" ? "Done" : "Save Changes"}
               </button>
            </div>
          </motion.div>
        </>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </AnimatePresence>
  );
}