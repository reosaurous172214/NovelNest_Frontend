import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaBookOpen,
  FaCloudUploadAlt,
  FaFeather
} from "react-icons/fa";
import NovelRow from "../../components/novel/NovelSlip";

export default function NovelUploads() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/novels/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNovels(res.data.novels || []);
      } catch (error) {
        console.error("Error fetching your novels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNovels();
  }, []);

  // Theme-Consistent Glass Base
  // Using bg-secondary and border variables ensures it adapts to Light, Dark, Sepia, etc.
  const glassBase = "bg-[var(--bg-secondary)] border border-[var(--border)] shadow-xl transition-all duration-500";

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-28 px-4 sm:px-6 pb-20 overflow-hidden transition-colors duration-500">
      
      {/* Background Glow - Adapts to Theme Accent */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className={`flex flex-col md:flex-row items-center justify-between p-8 md:p-12 mb-10 rounded-[2.5rem] ${glassBase}`}>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <FaCloudUploadAlt className="text-[var(--accent)]" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Author Console</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-[var(--text-main)]">
              Your <span className="text-[var(--accent)]">Manuscripts</span>
            </h1>
            <p className="mt-4 text-[var(--text-dim)] text-[10px] font-bold uppercase tracking-widest opacity-70">
              Total Publications: {novels.length}
            </p>
          </div>

          <button
            onClick={() => navigate("/novel/create")}
            className="mt-8 md:mt-0 flex items-center gap-4 bg-[var(--accent)] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-[var(--accent-glow)]"
          >
            <FaPlus /> Start New Project
          </button>
        </header>

        {/* --- LIST AREA --- */}
        <div className={`rounded-[2.5rem] p-6 md:p-10 ${glassBase}`}>
          <div className="flex items-center gap-6 mb-10 px-4">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-[var(--text-main)] whitespace-nowrap">
              Archive Management
            </h2>
            <div className="h-px w-full bg-[var(--border)] opacity-50" />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">
                  Fetching Data...
                </p>
              </div>
            ) : novels.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[2rem] bg-[var(--bg-primary)]/50">
                <FaFeather className="mx-auto mb-4 text-[var(--text-dim)] opacity-20" size={40} />
                <p className="text-[11px] text-[var(--text-dim)] mb-8 font-bold uppercase tracking-widest">
                  Your archive is currently empty
                </p>
                <button
                  onClick={() => navigate("/novel/create")}
                  className="px-8 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-black text-[10px] tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  Create Your First Entry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {novels.map((novel) => (
                  <div
                    key={novel._id}
                    className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[1.8rem] overflow-hidden hover:border-[var(--accent)] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="p-4 flex flex-col lg:flex-row items-center justify-between gap-6">
                      
                      {/* Novel Information Slip */}
                      <div className="flex-1 w-full">
                        <NovelRow
                          novel={novel}
                          showActions={false}
                        />
                      </div>

                      {/* Control Panel */}
                      <div className="flex items-center gap-2 w-full lg:w-auto">
                        <button
                          onClick={() => navigate(`/novel/edit/${novel._id}`)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all border border-[var(--accent)]/20"
                        >
                          <FaEdit size={12} /> Edit Chapters
                        </button>
                        
                        <button
                          onClick={() => navigate(`/novel/${novel._id}`)}
                          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-[var(--text-main)] hover:border-[var(--text-dim)] transition-all"
                        >
                          <FaBookOpen size={12} /> Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}