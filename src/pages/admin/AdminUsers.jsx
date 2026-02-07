import { useEffect, useState } from "react";
import { 
  LuUserX, 
  LuExternalLink, 
  LuRefreshCw, 
  LuShieldCheck,
  LuFingerprint 
} from "react-icons/lu"; 
import { useNavigate } from "react-router-dom";
import { fetchAllUsers, banUser, liftban } from "../../api/apiAdmin";
import { useAlert } from "../../context/AlertContext";

export default function AdminRequests() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers();
      setUsers(res || []);
    } catch (err) {
      showAlert("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Logic to open modal for banning
  const handleOpenBanModal = (user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const handleCloseModal = () => {
    setShowBanModal(false);
    setSelectedUser(null);
    setBanReason("");
  };

  // Protocol for Banning
  const handleConfirmBan = async () => {
    if (!banReason.trim()) return showAlert("Please provide a reason", "error");
    
    try {
      setActionLoading(true);
      const message = await banUser(selectedUser._id, banReason);
      showAlert(message || "User access restricted", "success");
      handleCloseModal();
      fetchUsers(); 
    } catch (err) {
      showAlert(err.message || "Ban protocol failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Protocol for Unbanning (Lift Ban)
  const handleLiftBan = async (user) => {
    try {
      setActionLoading(true);
      const message = await liftban(user._id);
      showAlert(message || "User access restored", "success");
      fetchUsers();
    } catch (err) {
      showAlert(err.message || "Unban protocol failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-[var(--bg-primary)] min-h-screen transition-colors duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-black text-[var(--accent)] uppercase tracking-tighter">
            User Management
          </h2>
          <p className="text-[var(--text-dim)] text-xs font-semibold uppercase tracking-widest">Administrative Oversight</p>
        </div>
        <span className="text-[10px] font-black bg-[var(--card)] px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-dim)]">
          {users.length} TOTAL ENTITIES
        </span>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-2xl backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-[var(--bg-primary)] border-b border-[var(--border)] text-[10px] uppercase font-black tracking-[0.2em] text-[var(--text-dim)]">
            <tr>
              <th className="p-6">User</th>
              <th className="p-6">Access</th>
              <th className="p-6">  Role</th>
              <th className="p-6 text-center">Wallet Balance</th>
              <th className="p-6 text-center">Mod Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="p-10 bg-[var(--bg-primary)] opacity-10"></td>
                </tr>
              ))
            ) : (
              users.map((u) => (
                <tr key={u._id} className={`hover:bg-[var(--bg-primary)] transition-colors group ${u.isBanned ? 'opacity-70' : ''}`}>
                  <td className="p-6">
                    <div className="font-bold text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                        {u.username} {u.isBanned && <span className="text-red-500 text-[8px] border border-red-500/30 px-1 ml-2">BANNED</span>}
                    </div>
                    <div className="text-[10px] font-medium text-[var(--text-dim)]">{u.email}</div>
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-0.5 rounded-lg bg-[var(--bg-primary)] text-[9px] font-black mr-2 border border-[var(--border)]">
                      {u.role}
                    </span></td>
                    <td className="p-6">
                    <span className={`text-xs font-bold ${u.isBanned ? 'text-red-500' : 'text-[var(--accent)]'}`}>
                      {u.isBanned ? "Restricted" : (u.subscription?.plan || "Standard")}
                    </span>
                  </td>
                  <td className="p-6 text-center font-mono font-bold text-[var(--text-main)]">
                    ₹{u.wallet?.balance?.toLocaleString() || 0}
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-6">
                      <button 
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-all hover:scale-125"
                      >
                        <LuExternalLink size={18} />
                      </button>

                      {u.isBanned ? (
                        <button 
                          onClick={() => handleLiftBan(u)}
                          disabled={actionLoading}
                          className="text-green-500 hover:text-green-400 transition-all hover:scale-125"
                          title="Lift Ban"
                        >
                          {actionLoading && selectedUser?._id === u._id ? <LuRefreshCw className="animate-spin" size={18} /> : <LuShieldCheck size={19} />}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenBanModal(u)}
                          className="text-[var(--text-dim)] hover:text-red-500 transition-all hover:scale-125"
                          title="Ban User"
                        >
                          <LuUserX size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BAN MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-red-500/30 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(239,68,68,0.1)]">
            <h3 className="text-2xl font-black mb-2 text-red-500 tracking-tighter flex items-center gap-3">
              <LuUserX size={24} /> RESTRICT ACCESS
            </h3>
            <p className="text-[var(--text-dim)] text-xs font-semibold mb-8 uppercase tracking-widest">
              Suspending Link for @{selectedUser?.username}
            </p>
            
            <textarea
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 text-sm focus:ring-1 focus:ring-red-500 outline-none h-32 mb-8 text-[var(--text-main)] placeholder-gray-600 shadow-inner resize-none"
              placeholder="Provide a formal reason for the audit log..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleCloseModal}
                className="py-4 rounded-2xl font-bold text-[var(--text-dim)] hover:bg-[var(--bg-primary)] transition-all uppercase text-[10px] tracking-widest border border-[var(--border)]"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBan}
                disabled={actionLoading}
                className="py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 uppercase text-[10px] tracking-widest"
              >
                {actionLoading ? <LuRefreshCw className="animate-spin" /> : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}