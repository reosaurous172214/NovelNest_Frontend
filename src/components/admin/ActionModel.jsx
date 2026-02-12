import  { useState } from "react";
import axios from "axios";
import { FaTimes, FaCheck, FaBan, FaInfoCircle } from "react-icons/fa";
import { getHeaders } from "../../getItems/getAuthItems";

const RequestActionModal = ({ request, onClose, onRefresh, showAlert }) => {
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const handleAction = async (status) => {
    setLoading(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/admin/request/${request._id}`,
        { status, adminNotes },
        getHeaders()
      );
      showAlert(`Request ${status} successfully`, "success");
      onRefresh(); // Refresh the list
      onClose();   // Close modal
    } catch (err) {
      showAlert(err.response?.data?.message || "Action failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--border)]">
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-main)]">Protocol Detail</h2>
          <button onClick={onClose} className="text-[var(--text-dim)] hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
            <FaInfoCircle className="text-[var(--accent)] mt-1" />
            <div>
              <p className="text-[10px] font-black uppercase text-[var(--accent)] mb-1">{request.type.replace('_', ' ')}</p>
              <h3 className="text-lg font-bold text-[var(--text-main)] leading-tight">{request.subject}</h3>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest">User Description</label>
            <div className="p-4 bg-[var(--bg-primary)]/50 border border-[var(--border)] rounded-xl text-sm text-[var(--text-dim)] leading-relaxed max-h-40 overflow-y-auto">
              {request.description}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest">Admin Notes (Optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Reason for approval or rejection..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent)] transition-all h-24 resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-[var(--bg-primary)]/30 border-t border-[var(--border)]">
          <button
            onClick={() => handleAction("rejected")}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 border border-rose-500/50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
          >
            <FaBan /> Reject
          </button>
          <button
            onClick={() => handleAction("approved")}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[var(--accent)]/20 transition-all disabled:opacity-50"
          >
            <FaCheck /> Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestActionModal;