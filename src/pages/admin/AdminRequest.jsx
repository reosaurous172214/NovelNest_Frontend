import { useEffect, useState } from "react";
import { 
  LuExternalLink, 
  LuSearch, 
  LuFilter, 
  LuUser, 
  LuShieldCheck, 
  LuUserX, 
  LuRefreshCw,
  LuLayoutDashboard
} from "react-icons/lu"; 
import { fetchAllUsers, banUser, liftban } from "../../api/apiAdmin";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import UserDrawer from "../../components/admin/UserDrawer.jsx";
import WalletDisplay from "../../components/balance/WalletDisplay.jsx";

export default function AdminRequests() {
  const { showAlert } = useAlert();
  const { wallet: adminWallet } = useAuth(); // Access Admin's own wallet from context
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const [drawerUser, setDrawerUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchAllUsers();
      setUsers(res || []);
    } catch (err) {
      showAlert("Failed to load records", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDrawer = (user) => {
    setDrawerUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseModal = () => {
    setShowBanModal(false);
    setSelectedUser(null);
    setBanReason("");
  };

  const handleConfirmBan = async () => {
    if (!banReason.trim()) return showAlert("Please provide a reason", "error");
    try {
      setActionLoading(true);
      const message = await banUser(selectedUser._id, banReason);
      showAlert(message || "User suspended", "success");
      handleCloseModal();
      fetchUsers(); 
    } catch (err) {
      showAlert(err.message || "Action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLiftBan = async (user) => {
    try {
      setActionLoading(true);
      setSelectedUser(user);
      await liftban(user._id);
      showAlert("User access restored", "success");
      fetchUsers();
    } catch (err) {
      showAlert("Failed to lift ban", "error");
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  const renderProfilePic = (u) => {
    const hasPic = u.profilePicture && typeof u.profilePicture === 'string';
    const imgSrc = hasPic && u.profilePicture.startsWith('http') 
      ? u.profilePicture 
      : `${process.env.REACT_APP_API_URL}/${u.profilePicture}`;

    return (
      <div className={`relative w-10 h-10 rounded-lg overflow-hidden border flex items-center justify-center transition-all ${u.isBanned ? 'grayscale opacity-50' : 'border-[var(--border)] shadow-sm'}`}>
        {hasPic ? (
          <img src={imgSrc} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        ) : null}
        <div className={`${hasPic ? 'hidden' : 'flex'} items-center justify-center bg-[var(--bg-primary)] text-[var(--text-dim)] w-full h-full`}>
          <LuUser size={18} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-[var(--bg-primary)] min-h-screen font-sans text-[var(--text-main)] transition-colors duration-500">
      
      {/* HEADER & SYSTEM STATS */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <LuLayoutDashboard className="text-[var(--accent)]" /> User Registry
          </h1>
          <p className="text-[var(--text-dim)] text-xs uppercase tracking-widest font-bold mt-1">
            System Administrative Control
          </p>
        </div>

        {/* Admin's own wallet from AuthContext */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
           <div>
              <p className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-tighter">System Reserve</p>
              <div className="font-mono font-bold text-sm">
                <WalletDisplay balance={adminWallet?.balance || 0} size={14} />
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent)] transition-all shadow-inner" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-xs font-bold uppercase text-[var(--text-dim)] hover:text-[var(--accent)] transition-all">
            <LuFilter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* REGISTRY TABLE */}
      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-primary)]/50 border-b border-[var(--border)]">
                <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-[var(--text-dim)]">Member Identity</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-[var(--text-dim)]">Role</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-[var(--text-dim)]">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-[var(--text-dim)]">NC Balance</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black tracking-widest text-[var(--text-dim)] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6"><div className="h-12 bg-[var(--bg-primary)] rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {renderProfilePic(u)}
                        <div>
                          <div className={`text-sm font-black ${u.isBanned ? 'text-[var(--text-dim)] line-through' : 'text-[var(--text-main)]'}`}>{u.username}</div>
                          <div className="text-[10px] text-[var(--text-dim)] font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[9px] font-black uppercase tracking-tighter">{u.role}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shadow-sm ${u.isBanned ? 'bg-red-500' : 'bg-emerald-500 shadow-emerald-500/20 animate-pulse'}`} />
                        <span className={`font-bold uppercase text-[10px] ${u.isBanned ? 'text-red-500' : 'text-emerald-500'}`}>
                          {u.isBanned ? 'Suspended' : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-mono font-black text-sm">
                        {/* Pulling specific user's wallet balance */}
                        <WalletDisplay balance={u.wallet?.balance || 0} size={13} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleOpenDrawer(u)} className="p-2.5 text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-[var(--bg-primary)] rounded-xl transition-all shadow-sm">
                          <LuExternalLink size={18} />
                        </button>
                        {u.isBanned ? (
                          <button onClick={() => handleLiftBan(u)} disabled={actionLoading} className="p-2.5 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
                            {actionLoading && selectedUser?._id === u._id ? <LuRefreshCw className="animate-spin" size={18} /> : <LuShieldCheck size={18} />}
                          </button>
                        ) : (
                          <button onClick={() => { setSelectedUser(u); setShowBanModal(true); }} className="p-2.5 text-[var(--text-dim)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                            <LuUserX size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center text-[var(--text-dim)] uppercase tracking-widest text-xs font-bold">
                    No registry matches found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserDrawer user={drawerUser} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* SUSPENSION MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-[2.5rem] shadow-2xl border border-[var(--border)] overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 flex items-center justify-center bg-red-500/10 text-red-500 rounded-2xl shadow-inner">
                  <LuUserX size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black">Restrict Access</h3>
                  <p className="text-[10px] text-red-500 uppercase tracking-widest font-black">Official Action Required</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-dim)] mb-6">
                Suspending <span className="font-black text-[var(--text-main)]">@{selectedUser?.username}</span> will revoke all reading and financial permissions immediately.
              </p>
              <textarea
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-5 text-sm outline-none focus:border-red-500 transition-all h-32 resize-none text-[var(--text-main)] shadow-inner"
                placeholder="Detail the violation (e.g., policy breach, fraudulent activity)..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="p-6 bg-[var(--bg-primary)]/50 border-t border-[var(--border)] flex gap-4">
              <button onClick={handleCloseModal} className="flex-1 px-6 py-4 text-xs font-black uppercase text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors">Abort</button>
              <button onClick={handleConfirmBan} disabled={actionLoading} className="flex-1 px-6 py-4 bg-red-600 text-white text-xs font-black uppercase rounded-2xl hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50 transition-all">Confirm Suspension</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}