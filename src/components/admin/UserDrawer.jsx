import { LuX, LuUser, LuMail, LuShield, LuWallet, LuCalendar, LuBan } from "react-icons/lu";

export default function UserDrawer({ user, isOpen, onClose }) {
  if (!user) return null;

  // Same logic as before to handle profile pictures safely
  const renderAvatar = () => {
    const hasPic = user.profilePicture && typeof user.profilePicture === 'string';
    const isExternal = hasPic && user.profilePicture.startsWith('http');
    const imgSrc = isExternal ? user.profilePicture : `${process.env.REACT_APP_API_URL}/${user.profilePicture}`;

    return (
      <div className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] ${user.isBanned ? 'border-red-500/50 grayscale' : 'border-[var(--accent)]/30'}`}>
        {hasPic ? (
          <img 
            src={imgSrc} 
            alt="" 
            className="w-full h-full object-cover" 
            onError={(e) => { 
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} 
          />
        ) : null}
        <div className={`${hasPic ? 'hidden' : 'flex'} items-center justify-center text-[var(--text-dim)]`}>
          <LuUser size={40} />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Background Dimmer */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-[var(--bg-secondary)] border-l border-[var(--border)] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--bg-primary)]">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[10px] uppercase tracking-[0.2em]">
            <LuShield size={16} /> Member Profile: {user._id.slice(-6)}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--border)] rounded-lg text-[var(--text-dim)] transition-colors">
            <LuX size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-8 overflow-y-auto h-[calc(100%-3.5rem)] custom-scrollbar space-y-8">
          
          {/* Identity Section */}
          <div className="flex flex-col items-center text-center">
            {renderAvatar()}
            <h2 className="mt-4 text-xl font-bold text-[var(--text-main)]">{user.username}</h2>
            <p className="text-sm text-[var(--text-dim)] flex items-center gap-1">
              <LuMail size={14} /> {user.email}
            </p>
            {user.isBanned && (
              <span className="mt-2 px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20">
                Account Suspended
              </span>
            )}
          </div>

          {/* Account Details Ledger */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl">
              <LuShield className="text-[var(--accent)] mb-1" size={14}/>
              <p className="text-sm font-bold text-[var(--text-main)] uppercase tracking-tighter">{user.role || "Member"}</p>
              <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold">System Role</p>
            </div>
            <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl">
              <LuWallet className="text-emerald-500 mb-1" size={14}/>
              <p className="text-sm font-bold text-[var(--text-main)]">₹{user.wallet?.balance?.toLocaleString() || 0}</p>
              <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold">Wallet Balance</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2">
                <LuCalendar size={12}/> Join Date
              </span>
              <span className="text-xs font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest flex items-center gap-2">
                <LuBan size={12}/> Account Status
              </span>
              <span className={`text-xs font-bold ${user.isBanned ? 'text-red-500' : 'text-emerald-500'}`}>
                {user.isBanned ? 'Restricted' : 'Verified'}
              </span>
            </div>
          </div>

          {/* Action Note */}
          <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl border-dashed">
            <p className="text-[10px] text-[var(--text-dim)] leading-relaxed">
              Use the main ledger actions to modify this user's permissions or access status. All modifications are logged in the Audit Trail.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}