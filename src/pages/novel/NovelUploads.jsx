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

  // Reduced rounding and padding for a cleaner, less "gigantic" feel
  const glassBase = "bg-[var(--bg-secondary)] border border-[var(--border)] shadow-sm transition-all duration-500";

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] pt-24 px-4 sm:px-6 pb-12 transition-colors duration-500 font-sans">
      
      {/* Background Glow - Dimmed opacity */}
      <div className="absolute top-[-5%] right-[-2%] w-[400px] h-[400px] bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className={`flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 mb-6 rounded-2xl ${glassBase}`}>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <FaCloudUploadAlt className="text-[var(--accent)]" size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">Author Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Your <span className="text-[var(--accent)]">Works</span>
            </h1>
            <p className="mt-1 text-[var(--text-dim)] text-xs font-medium">
              You have {novels.length} published novels and drafts.
            </p>
          </div>

          <button
            onClick={() => navigate("/novel/create")}
            className="mt-6 sm:mt-0 flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-bold text-xs hover:brightness-105 active:scale-95 shadow-md transition-all"
          >
            <FaPlus size={12} /> New Novel
          </button>
        </header>

        {/* --- LIST AREA --- */}
        <div className={`rounded-2xl p-4 sm:p-6 ${glassBase}`}>
          <div className="flex items-center gap-4 mb-6 px-2">
            <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide whitespace-nowrap">
              Manage Stories
            </h2>
            <div className="h-px w-full bg-[var(--border)] opacity-20" />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest">
                  Loading...
                </p>
              </div>
            ) : novels.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-primary)]/30">
                <FaFeather className="mx-auto mb-3 text-[var(--text-dim)] opacity-20" size={28} />
                <p className="text-xs text-[var(--text-dim)] mb-6 font-semibold">
                  You haven't uploaded anything yet.
                </p>
                <button
                  onClick={() => navigate("/novel/create")}
                  className="px-5 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] font-bold text-[10px] hover:bg-[var(--accent)] hover:text-white transition-all"
                >
                  Start Writing
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {novels.map((novel) => (
                  <div
                    key={novel._id}
                    className="group bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/40 transition-all duration-300"
                  >
                    <div className="p-3 flex flex-col md:flex-row items-center justify-between gap-4">
                      
                      {/* Novel Information Slip */}
                      <div className="flex-1 w-full scale-95 origin-left">
                        <NovelRow
                          novel={novel}
                          showActions={false}
                        />
                      </div>

                      {/* Control Panel */}
                      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                        <button
                          onClick={() => navigate(`/novel/edit/${novel._id}`)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent)]/5 text-[var(--accent)] rounded-lg font-bold text-[10px] uppercase border border-[var(--accent)]/10 hover:bg-[var(--accent)] hover:text-white transition-all"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        
                        <button
                          onClick={() => navigate(`/novel/${novel._id}`)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-dim)] rounded-lg font-bold text-[10px] uppercase hover:text-[var(--text-main)] transition-all"
                        >
                          <FaBookOpen size={12} /> View
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