import { Link, useLocation } from "react-router-dom";
// Clean, professional icons from Lucide/Remix
import { 
  RiDashboardLine, 
  RiBookLine, 
  RiMailSendLine, 
  RiHistoryLine, 
  RiLayoutLine, 
  RiShieldLine,
  RiCloseLine,
  RiLogoutBoxRLine 
} from "react-icons/ri"; 
import Logo from "./AdminLogo";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: <RiDashboardLine /> },
    { to: '/admin/novels', label: 'Novels', icon: <RiBookLine /> },
    { to: '/admin/requests', label: 'Requests', icon: <RiMailSendLine /> },
    { to: '/admin/activity', label: 'Activity', icon: <RiHistoryLine /> },
    { to: '/admin/appearance', label: 'Appearance', icon: <RiLayoutLine /> },
    { to: '/admin/audit', label: 'Audit Logs', icon: <RiShieldLine /> },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-secondary)] border-r border-[var(--border)] p-6 flex flex-col transition-transform duration-300
      md:relative md:translate-x-0 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Logo />
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-[var(--text-dim)] hover:text-[var(--text-main)]"
        >
          <RiCloseLine size={24} />
        </button>
      </div>
      
      {/* Links */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all
                ${isActive 
                  ? "bg-[var(--accent)] text-white shadow-md" 
                  : "text-[var(--text-dim)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Exit */}
      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] text-[var(--text-dim)] border border-[var(--border)] font-bold text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
        >
          <RiLogoutBoxRLine size={18} /> Exit Admin
        </Link>
      </div>
    </aside>
  );
}