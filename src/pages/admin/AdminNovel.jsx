import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { fetchAllNovels, deleteNovel } from "../../api/apiAdmin.js";
import { useAlert } from "../../context/AlertContext.jsx";
export default function AdminNovels() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const { showAlert } = useAlert();
  useEffect(() => {
    loadNovels();
  }, []);

  const loadNovels = async () => {
    setLoading(true);
    const data = await fetchAllNovels();
    setNovels(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // OPEN MODAL
  const confirmDelete = (novel) => {
    setSelectedNovel(novel);
    setIsModalOpen(true);
  };

  // ACTUAL DELETE LOGIC
  const deleteHandler = async () => {
    if (!selectedNovel) return;

    const success = await deleteNovel(
      selectedNovel._id,
      "Policy Violation / Admin Action",
    );

    if (success) {
      setNovels((prev) => prev.filter((n) => n._id !== selectedNovel._id));
      showAlert("Deleted Novel Successfully", "success");
      setIsModalOpen(false);
      setSelectedNovel(null);
    } else {
      alert("Error deleting novel. Please try again.");
    }
  };

  // --- CRITICAL FIX: Define filteredNovels here ---
  const filteredNovels = novels.filter((novel) =>
    novel.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-[var(--text-main)]">
            Novel Database
          </h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] px-4 py-2 rounded-lg text-sm outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-main)]"
            />
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-[var(--bg-primary)] text-[var(--text-dim)] text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Author</th>
                <th className="p-4 font-semibold">Chapters</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[var(--text-dim)]"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                      <span>Fetching records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredNovels.length > 0 ? (
                filteredNovels.map((novel) => (
                  <tr
                    key={novel._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 font-medium text-[var(--text-main)]">
                      {novel.title}
                    </td>
                    <td className="p-4 text-[var(--text-dim)]">
                      {novel.author?.username || "Unknown Author"}
                    </td>
                    <td className="p-4 text-[var(--text-main)]">
                      {novel.totalChapters || 0}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          novel.isPublished
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {novel.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3 text-[var(--text-dim)]">
                        <button
                          onClick={() => navigate(`/admin/novels/${novel._id}`)}
                          title="View"
                          className="hover:text-[var(--accent)] transition-colors"
                        >
                          <FaExternalLinkAlt />
                        </button>
                        <button
                          title="Edit"
                          className="hover:text-blue-500 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(novel)}
                          title="Delete"
                          className="hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-20 text-center text-[var(--text-dim)]"
                  >
                    No novels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center gap-4 text-red-500 mb-4">
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <FaExclamationTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>

            <p className="text-[var(--text-dim)] mb-6">
              Are you sure you want to delete{" "}
              <span className="text-[var(--text-main)] font-semibold">
                "{selectedNovel?.title}"
              </span>
              ? This action cannot be undone and will remove all associated
              chapters.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-[var(--text-main)] bg-[var(--bg-primary)] border border-[var(--border)] hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteHandler}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
              >
                Delete Novel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
