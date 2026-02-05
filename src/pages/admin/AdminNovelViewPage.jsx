import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaEye, FaBookOpen, FaUser, FaTags, FaCalendarAlt } from 'react-icons/fa';
import { fetchNovelById } from '../../api/apiAdmin.js';

export default function AdminNovelView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNovelData = async () => {
      setLoading(true);
      const data = await fetchNovelById(id);
      setNovel(data);
      setLoading(false);
    };
    getNovelData();
  }, [id]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center text-[var(--accent)] font-bold animate-pulse">
      INITIALIZING SCAN...
    </div>
  );

  if (!novel) return (
    <div className="text-center p-10 bg-red-500/10 border border-red-500 rounded-xl">
      <h2 className="text-red-500 font-bold">DATA CORRUPTION: NOVEL NOT FOUND</h2>
      <button onClick={() => navigate('/admin/novels')} className="mt-4 text-sm underline">Return to Database</button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/admin/novels')}
          className="flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
        >
          <FaArrowLeft /> Back to Database
        </button>
        <button className="bg-[var(--accent)] hover:opacity-80 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-[var(--accent-glow)]">
          <FaEdit /> Edit Metadata
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Cover & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 overflow-hidden">
            <img 
              src={novel.coverImage || 'https://via.placeholder.com/400x600'} 
              alt={novel.title} 
              className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 rounded-xl text-center">
              <FaEye className="mx-auto text-[var(--accent)] mb-1" />
              <div className="text-xl font-bold">{novel.views || 0}</div>
              <div className="text-[var(--text-dim)] text-xs uppercase">Views</div>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 rounded-xl text-center">
              <FaBookOpen className="mx-auto text-[var(--accent)] mb-1" />
              <div className="text-xl font-bold">{novel.totalChapters || 0}</div>
              <div className="text-[var(--text-dim)] text-xs uppercase">Chapters</div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                novel.isPublished ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
              }`}>
                {novel.isPublished ? 'SYSTEM ACTIVE' : 'DRAFT MODE'}
              </span>
              <span className="text-[var(--text-dim)] text-sm flex items-center gap-2">
                <FaCalendarAlt /> Created: {new Date(novel.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)] mb-4 uppercase tracking-tighter">
              {novel.title}
            </h1>

            <div className="flex items-center gap-3 mb-6 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] w-fit">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-white">
                {novel.author?.[0] || 'A'}
              </div>
              <div>
                <div className="text-xs text-[var(--text-dim)] uppercase font-bold">Lead Author</div>
                <div className="text-[var(--text-main)] font-bold">{novel.author || "Unknown"}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest">Synopsis</h3>
              <p className="text-[var(--text-dim)] leading-relaxed italic">
                {novel.description || "No description provided."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text-main)] mb-3 flex items-center gap-2 uppercase">
                <FaTags className="text-[var(--accent)]" /> Registered Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {novel.genres?.map(genre => (
                  <span key={genre} className="bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-1 rounded-lg text-xs text-[var(--text-dim)]">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}