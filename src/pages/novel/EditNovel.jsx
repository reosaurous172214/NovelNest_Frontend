import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaSave,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaBook,
  FaTerminal,
} from "react-icons/fa";

export default function EditNovel() {
  const { id } = useParams();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    fetchNovel();
  }, [id]);

  const fetchNovel = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/novels/${id}`,
        authConfig
      );
      setNovel(res.data);

      const chapRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/chapters/novel/${id}`
      );
      
      const rawData = Array.isArray(chapRes.data)
        ? chapRes.data
        : chapRes.data.chapters || [];
      
      // Sort newest at the top for easy management
      setChapters(
        [...rawData].sort((a, b) => b.chapterNumber - a.chapterNumber)
      );
    } catch (err) {
      console.error("Workspace sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateChapter = async () => {
    if (!title || !content) return;

    try {
      if (editingId) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/chapters/${editingId}`,
          { title, content },
          authConfig
        );
      } else {
        // Step 1: Create the chapter
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/chapters`,
          { novelId: id, title, content },
          authConfig
        );

        // Step 2: Sync the novel's chapter count
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/novels/${id}`,
          { incrementBy: 1 },
          authConfig
        );
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      fetchNovel();
    } catch (err) {
      console.error(
        "Save failed:",
        err.response?.data?.message || err.message
      );
    }
  };

  const editChapter = (ch) => {
    setTitle(ch.title);
    setContent(ch.content);
    setEditingId(ch._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteChapter = async (chapterId) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/chapters/${chapterId}`,
        authConfig
      );
      fetchNovel();
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center font-mono text-[var(--accent)] animate-pulse">
        CALIBRATING WRITER WORKSPACE...
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] py-24 px-6 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 text-left border-b border-[var(--border)] pb-8">
          <div className="space-y-2">
            <Link
              to="/novel/author/me"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors mb-4"
            >
              <FaChevronLeft size={8} /> Back to Library
            </Link>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
              Editing: <span className="text-[var(--accent)]">{novel.title}</span>
            </h1>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-5 rounded-2xl flex items-center gap-5 shadow-2xl">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-[var(--text-dim)] tracking-widest">
                Published Chapters
              </p>
              <p className="text-2xl font-black text-[var(--accent)]">
                {chapters.length}
              </p>
            </div>
            <FaBook className="text-[var(--accent)] opacity-20 text-4xl" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* EDITOR AREA */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-8 md:p-12 rounded-[3rem] shadow-2xl relative">
              <div className="flex items-center gap-3 mb-10">
                <FaTerminal className="text-[var(--accent)]" size={16} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-dim)]">
                  {editingId ? "Update Manuscript" : "New Manuscript Draft"}
                </h2>
              </div>

              <div className="space-y-8 text-left">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] ml-1">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Chapter 1: The Beginning"
                    className="w-full p-5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl text-[var(--text-main)] outline-none focus:border-[var(--accent)]/50 transition-all font-bold text-xl"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] ml-1">
                    Content Body
                  </label>
                  <textarea
                    placeholder="Tell your story..."
                    className="w-full p-8 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[2.5rem] text-[var(--text-main)] outline-none h-[600px] focus:border-[var(--accent)]/50 transition-all leading-relaxed text-lg resize-none scrollbar-hide"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={addOrUpdateChapter}
                    className="flex-1 py-5 bg-[var(--accent)] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-[var(--accent-glow)] hover:brightness-110 active:scale-95 transition-all"
                  >
                    {editingId ? (
                      <><FaSave /> Commit Changes</>
                    ) : (
                      <><FaPlus /> Publish to Library</>
                    )}
                  </button>

                  {editingId && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setTitle("");
                        setContent("");
                      }}
                      className="px-10 py-5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all"
                    >
                      Discard Draft
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR: TABLE OF CONTENTS */}
          <div className="space-y-6">
            <div className="sticky top-32">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-dim)] mb-8 text-left ml-4 italic">
                Manuscript Index
              </h3>
              <div className="max-h-[700px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
                {chapters.length === 0 ? (
                  <div className="p-12 border border-dashed border-[var(--border)] rounded-[2.5rem] text-center opacity-30 italic text-sm">
                    Workspace Empty. Begin writing...
                  </div>
                ) : (
                  chapters.map((ch, idx) => (
                    <div
                      key={ch._id}
                      className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-2xl flex justify-between items-center group hover:border-[var(--accent)]/40 transition-all shadow-lg"
                    >
                      <div className="text-left min-w-0 pr-4">
                        <h4 className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest mb-1 opacity-70">
                          Index {chapters.length - idx}
                        </h4>
                        <p className="text-sm font-black text-[var(--text-main)] truncate italic">
                          {ch.title}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => editChapter(ch)}
                          className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => deleteChapter(ch._id)}
                          className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] hover:text-red-500 hover:border-red-500/50 transition-all"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}