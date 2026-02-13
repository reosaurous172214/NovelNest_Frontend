import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  RiDashboardLine, RiLineChartLine, RiBookReadLine, 
  RiWallet3Line, RiSettings4Line, RiLogoutBoxRLine, RiCloseLine 
} from "react-icons/ri";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { to: "/dashboard", label: "Overview", icon: <RiDashboardLine /> },
    { to: "/dashboard/analytics", label: "Analytics", icon: <RiLineChartLine /> },
    { to: "/dashboard/library", label: "My Library", icon: <RiBookReadLine /> },
    { to: "/wallet", label: "Wallet", icon: <RiWallet3Line /> },
  ];

  return (
    <aside className={`
      fixed left-0 top-0 h-full w-72 bg-[var(--bg-secondary)] border-r border-[var(--border)] z-[150]
      transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      flex flex-col p-8 shadow-2xl
    `}>
      
      {/* Header with Close Button */}
      <div className="flex items-center justify-between mb-12">
        <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.3em]">Console</p>
        <button onClick={onClose} className="p-2 bg-[var(--bg-primary)] rounded-xl text-[var(--text-dim)] hover:text-red-500 transition-colors">
          <RiCloseLine size={24} />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all
              ${location.pathname === item.to 
                ? "bg-[var(--accent)] text-white shadow-lg" 
                : "text-[var(--text-dim)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"}`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-[var(--border)] space-y-3">
        <Link to="/settings" onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-[var(--text-dim)] font-bold text-sm hover:text-[var(--text-main)] transition-colors">
          <RiSettings4Line size={22} /> Settings
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-500/10 rounded-2xl transition-all">
          <RiLogoutBoxRLine size={22} /> Logout
        </button>
      </div>
    </aside>
  );
}