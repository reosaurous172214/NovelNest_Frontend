import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  LuExternalLink, 
  LuSearch, 
  LuUser, 
  LuShieldCheck, 
  LuUserX, 
  LuRefreshCw,
  LuTrash2
} from "react-icons/lu"; 
import { fetchAllUsers, banUser, liftban } from "../../api/apiAdmin";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext"; 
import { getHeaders } from "../../getItems/getAuthItems";
import UserDrawer from "../../components/admin/UserDrawer.jsx";
import WalletDisplay from "../../components/balance/WalletDisplay.jsx";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function UserRegistry() {
  const { showAlert } = useAlert();
  const { wallet: adminWallet } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const [drawerUser, setDrawerUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers();
      setUsers(res || []);
    } catch (err) {
      showAlert("Failed to load records", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDrawer = (user) => {
    setDrawerUser(user);
    setIsDrawerOpen(true);
  };

  const handleConfirmBan = async () => {
    if (!banReason.trim()) return showAlert("Please provide a reason", "error");
    try {
      setActionLoading(true);
      const message = await banUser(selectedUser._id, banReason);
      showAlert(message || "User suspended", "success");
      setShowBanModal(false);
      setBanReason("");
      fetchUsers(); 
    } catch (err) {
      showAlert(err.message || "Action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLiftBan = async (userId) => {
    try {
      setActionLoading(true);
      await liftban(userId);
      showAlert("Access restored", "success");
      fetchUsers();
    } catch (err) {
      showAlert("Failed to lift ban", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    try {
      setActionLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/delete/users/${selectedUser._id}`, getHeaders());
      showAlert("User permanently removed", "success");
      fetchUsers();
    } catch (err) {
      showAlert("Failed to delete member", "error");
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  const renderAvatar = (u) => {
    const hasPic = u.profilePicture && typeof u.profilePicture === 'string';
    const imgSrc = hasPic && u.profilePicture.startsWith('http') 
      ? u.profilePicture 
      : `${process.env.REACT_APP_API_URL}${u.profilePicture}`;

    return (
      <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${u.isBanned ? 'grayscale border-red-500/20' : 'border-[var(--border)]'}`}>
        {hasPic ? (
          <img src={imgSrc} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-dim)]">
            <LuUser size={20} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 bg-[var(--bg-primary)] min-h-screen font-sans text-[var(--text-main)]">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Registry</h1>
          <p className="text-[var(--text-dim)] text-sm mt-1">Manage and monitor community members.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent)] transition-all" 
            />
          </div>
          
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] px-5 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
             <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase">System Reserve</span>
             <WalletDisplay balance={adminWallet?.balance || 0} size={14} />
          </div>

          <button onClick={fetchUsers} className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-dim)] hover:text-[var(--accent)] transition-all active:scale-95 shadow-sm">
            <LuRefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* MEMBER LIST (ROW STYLE) */}
      <div className="max-w-7xl mx-auto space-y-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] animate-pulse opacity-50"></div>
          ))
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div 
              key={u._id} 
              className="group flex flex-col md:flex-row items-center justify-between bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 transition-all hover:border-[var(--accent)] hover:translate-x-1 shadow-sm gap-4"
            >
              {/* Identity Section */}
              <div className="flex items-center gap-4 min-w-[300px] w-full md:w-auto">
                {renderAvatar(u)}
                <div className="overflow-hidden">
                  <h3 className="font-bold text-base leading-tight flex items-center gap-2">
                    {u.username}
                    <span className="px-1.5 py-0.5 bg-[var(--bg-primary)] text-[8px] font-black rounded border border-[var(--border)] uppercase opacity-70">
                      {u.role}
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--text-dim)] truncate">{u.email}</p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex flex-1 items-center justify-between md:justify-around w-full max-w-xl">
                <div className="text-center">
                  <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold mb-1">Status</p>
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className={`w-1.5 h-1.5 rounded-full ${u.isBanned ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                    <span className={`text-[10px] font-bold uppercase ${u.isBanned ? 'text-red-500' : 'text-emerald-500'}`}>
                      {u.isBanned ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold mb-1">NC Balance</p>
                  <div className="font-mono">
                    <WalletDisplay balance={u.wallet?.balance || 0} size={12} />
                  </div>
                </div>

                <div className="hidden lg:block text-center">
                   <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold mb-1">Joined</p>
                   <span className="text-[10px] font-medium text-[var(--text-dim)]">
                     {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                   </span>
                </div>
              </div>

              {/* Action Cluster */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button 
                  onClick={() => handleOpenDrawer(u)} 
                  className="p-2.5 text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-[var(--bg-primary)] rounded-xl transition-all border border-transparent hover:border-[var(--border)]"
                  title="View Details"
                >
                  <LuExternalLink size={18} />
                </button>
                
                {u.isBanned ? (
                  <button 
                    onClick={() => handleLiftBan(u._id)} 
                    className="p-2.5 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl transition-all border border-emerald-500/10"
                    title="Lift Suspension"
                  >
                    <LuShieldCheck size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => { setSelectedUser(u); setShowBanModal(true); }} 
                    className="p-2.5 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl transition-all border border-rose-500/10"
                    title="Suspend User"
                  >
                    <LuUserX size={18} />
                  </button>
                )}

                <button 
                  onClick={() => { setSelectedUser(u); setIsDeleteModalOpen(true); }} 
                  className="p-2.5 text-[var(--text-dim)] bg-gray-500/5 hover:bg-black hover:text-white rounded-xl transition-all border border-gray-500/10"
                  title="Delete User"
                >
                  <LuTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-[var(--bg-secondary)] border border-dashed border-[var(--border)] rounded-[2.5rem]">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)]">No matches found</p>
          </div>
        )}
      </div>

      <UserDrawer user={drawerUser} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* SUSPENSION MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-[2.5rem] shadow-2xl border border-[var(--border)] p-8">
            <h3 className="text-xl font-bold mb-2 text-red-500">Suspend Access</h3>
            <p className="text-sm text-[var(--text-dim)] mb-6">A reason is required for administrative audit logs.</p>
            <textarea
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4 text-sm outline-none focus:border-red-500 transition-all h-32 resize-none mb-6 text-[var(--text-main)]"
              placeholder="Explain the reason for suspension..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowBanModal(false)} className="flex-1 py-4 text-sm font-bold text-[var(--text-dim)] hover:text-[var(--text-main)]">Cancel</button>
              <button onClick={handleConfirmBan} disabled={actionLoading} className="flex-1 py-4 bg-red-600 text-white text-sm font-bold rounded-2xl hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20">Suspend</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Member"
        message={`Are you sure you want to permanently delete @${selectedUser?.username}? This will erase all their associated data.`}
        confirmText="Erase Data"
        type="danger"
      />
    </div>
  );
}