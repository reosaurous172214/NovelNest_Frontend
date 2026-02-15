import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuBook, LuEye, LuBookOpen, LuTag, LuInfo } from "react-icons/lu";

export default function NovelDrawer({ novel, isOpen, onClose }) {
  // Use AnimatePresence in the parent component where NovelDrawer is called 
  // or handle the conditional rendering here:
  if (!novel) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Right-aligned Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-lg bg-[var(--bg-secondary)] border-l border-[var(--border)] shadow-2xl"
          >
            
            {/* Header Section */}
            <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-primary)]">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[10px] uppercase tracking-[0.2em]">
                <LuBook size={16} /> Registry Detail: {novel._id.slice(-6)}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--border)] rounded-lg text-[var(--text-dim)] transition-colors">
                <LuX size={20} />
              </button>
            </div>

            {/* Content Section - Added Staggered Fade-in for Children */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 overflow-y-auto h-[calc(100%-3.5rem)] custom-scrollbar space-y-8"
            >
              {/* Cover Art Block */}
              <div className="aspect-[2/3] w-full max-w-[280px] mx-auto rounded-xl overflow-hidden border border-[var(--border)] shadow-xl bg-[var(--bg-primary)]">
                 <img 
                   src={novel.coverImage?.startsWith('http') ? novel.coverImage : `${process.env.REACT_APP_API_URL}${novel.coverImage}`} 
                   alt="" 
                   className="w-full h-full object-cover" 
                   onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Cover"; }}
                 />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-1">{novel.title}</h2>
                <p className="text-sm font-semibold text-[var(--accent)] mb-6">By {novel.author?.username || "Anonymous"}</p>
                
                {/* Quick Stats Ledger */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-center">
                    <LuEye className="mx-auto text-[var(--text-dim)] mb-1" size={16}/>
                    <p className="text-lg font-bold text-[var(--text-main)]">{novel.views || 0}</p>
                    <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-tighter">Total Views</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-center">
                    <LuBookOpen className="mx-auto text-[var(--text-dim)] mb-1" size={16}/>
                    <p className="text-lg font-bold text-[var(--text-main)]">{novel.totalChapters || 0}</p>
                    <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-tighter">Chapters</p>
                  </div>
                </div>
              </div>

              {/* Taxonomy Tags */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest border-b border-[var(--border)] pb-2 flex items-center gap-2">
                  <LuTag size={12}/> Metadata Taxonomy
                </h3>
                <div className="flex flex-wrap gap-2">
                  {novel.genres?.map(g => (
                    <span key={g} className="px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded text-[10px] font-bold text-[var(--text-main)] uppercase">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Synopsis Ledger */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest border-b border-[var(--border)] pb-2 flex items-center gap-2">
                  <LuInfo size={12}/> Internal Synopsis
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-dim)] italic">
                  {novel.description || "Historical data unavailable for this entry."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}