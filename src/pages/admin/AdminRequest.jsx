import { useEffect, useState } from "react";
import { 
  LuExternalLink, 
  LuSearch, 
  LuFilter, 
  LuUser, 
  LuShieldCheck, 
  LuUserX, 
  LuRefreshCw 
} from "react-icons/lu"; 
import { fetchAllUsers, banUser, liftban } from "../../api/apiAdmin";
import { useAlert } from "../../context/AlertContext";
import UserDrawer from "../../components/admin/UserDrawer.jsx";

export default function AdminRequests() {
  const { showAlert } = useAlert();
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

  // Search Logic
  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDrawer = (user) => {
    setDrawerUser(user);
    setIsDrawerOpen(true);
  };

  // Close the ban box
  const handleCloseModal = () => {
    setShowBanModal(false);
    setSelectedUser(null);
    setBanReason("");
  };

  // Confirm the ban action
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
    const imgSrc = hasPic && u.profilePicture.startsWith('http') ? u.profilePicture : `${process.env.REACT_APP_API_URL}/${u.profilePicture}`;

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
    <div className="p-8 bg-[var(--bg-primary)] min-h-screen font-sans text-[var(--text-main)]">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Registry</h1>
          <p className="text-[var(--text-dim)] text-sm">Official administrative control for user accounts.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent)] text-[var(--text-main)]" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all">
            <LuFilter size={14} /> Filter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-dim)]">Member Identity</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-dim)]">Role</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-dim)]">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-dim)] text-right">Balance</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-dim)] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6"><div className="h-10 bg-[var(--bg-primary)] rounded-lg w-full"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-[var(--bg-primary)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {renderProfilePic(u)}
                        <div>
                          <div className={`text-sm font-semibold ${u.isBanned ? 'text-[var(--text-dim)]' : 'text-[var(--text-main)]'}`}>{u.username}</div>
                          <div className="text-xs text-[var(--text-dim)] lowercase">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[9px] font-bold uppercase">{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${u.isBanned ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        <span className={u.isBanned ? 'text-red-500' : 'text-[var(--text-main)]'}>{u.isBanned ? 'Suspended' : 'Active'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold">₹{u.wallet?.balance?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleOpenDrawer(u)} className="p-2 text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-[var(--bg-primary)] rounded-lg transition-all"><LuExternalLink size={16} /></button>
                        {u.isBanned ? (
                          <button onClick={() => handleLiftBan(u)} disabled={actionLoading} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                            {actionLoading && selectedUser?._id === u._id ? <LuRefreshCw className="animate-spin" size={16} /> : <LuShieldCheck size={16} />}
                          </button>
                        ) : (
                          <button onClick={() => { setSelectedUser(u); setShowBanModal(true); }} className="p-2 text-[var(--text-dim)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><LuUserX size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-[var(--text-dim)]">
                    No members found matching "{searchTerm}"
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--bg-secondary)] rounded-2xl shadow-2xl border border-[var(--border)]">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl">
                  <LuUserX size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Restrict Access</h3>
                  <p className="text-xs text-[var(--text-dim)] uppercase tracking-widest font-bold">Action Log Required</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-dim)] mb-6">Suspending <span className="font-bold text-[var(--text-main)]">@{selectedUser?.username}</span> will stop platform access immediately.</p>
              <textarea
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-4 text-sm outline-none focus:border-red-400 transition-all h-28 resize-none text-[var(--text-main)]"
                placeholder="Reason for suspension..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="p-4 bg-[var(--bg-primary)] border-t border-[var(--border)] flex gap-3 rounded-b-2xl">
              <button onClick={handleCloseModal} className="flex-1 px-4 py-2.5 text-xs font-bold uppercase text-[var(--text-dim)]">Abort</button>
              <button onClick={handleConfirmBan} disabled={actionLoading} className="flex-1 px-4 py-2.5 bg-red-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-red-700 shadow-lg active:scale-95 disabled:opacity-50">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}