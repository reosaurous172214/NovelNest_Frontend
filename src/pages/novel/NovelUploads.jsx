import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaFingerprint,
  FaCircle,
  FaTerminal,
  FaEdit,
  FaBookOpen
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

  const glassBase = "bg-[var(--bg-secondary)] opacity-95 backdrop-blur-3xl border border-[var(--border)] shadow-2xl transition-all duration-500";

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-28 px-6 pb-20 overflow-hidden transition-colors duration-500">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--accent)] opacity-5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className={`flex flex-col md:flex-row items-center justify-between p-10 mb-12 rounded-[3rem] ${glassBase}`}>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
              Your <span className="text-[var(--accent)]">Stories</span>
            </h1>
            <p className="mt-4 text-[var(--text-dim)] text-xs font-bold uppercase tracking-widest">
              You have published {novels.length} novels
            </p>
          </div>

          <button
            onClick={() => navigate("/novel/create")}
            className="mt-8 md:mt-0 flex items-center gap-4 bg-[var(--accent)] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-[var(--accent-glow)]"
          >
            <FaPlus /> Write New Story
          </button>
        </header>

        {/* --- LIST AREA --- */}
        <div className={`rounded-[3rem] p-6 md:p-10 ${glassBase}`}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 px-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Manage Your Novels
            </h2>
            <div className="h-px flex-1 bg-[var(--border)] hidden md:block" />
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-sm font-bold text-[var(--text-dim)] uppercase">
                  Loading your stories...
                </p>
              </div>
            ) : novels.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[2.5rem]">
                <p className="text-sm text-[var(--text-dim)] mb-8 font-bold uppercase">
                  You haven't uploaded any stories yet.
                </p>
                <button
                  onClick={() => navigate("/novel/create")}
                  className="px-8 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-black text-[10px] tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  START YOUR FIRST NOVEL →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {novels.map((novel) => (
                  <div
                    key={novel._id}
                    className="group relative bg-[var(--bg-primary)] border border-[var(--border)] rounded-[2.2rem] overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-500"
                  >
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-6">
                      
                      {/* Using your existing Row component for the main info */}
                      <div className="flex-1 w-full">
                        <NovelRow
                          novel={novel}
                          showActions={false} // We are making custom actions below
                        />
                      </div>

                      {/* DIRECT EDIT BUTTONS */}
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                          onClick={() => navigate(`/novel/edit/${novel._id}`)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all"
                        >
                          <FaEdit size={14} /> Edit Chapters
                        </button>
                        
                        <button
                          onClick={() => navigate(`/novel/${novel._id}`)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-dim)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-[var(--text-main)] transition-all"
                        >
                          <FaBookOpen size={14} /> View Page
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