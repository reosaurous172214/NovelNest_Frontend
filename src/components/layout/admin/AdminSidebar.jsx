import { Link, useLocation } from "react-router-dom";
import { 
  RiDashboardLine, 
  RiBookLine, 
  RiMailSendLine, 
  RiHistoryLine, 
  RiLayoutLine, 
  RiShieldLine,
  RiCloseLine,
  RiLogoutBoxRLine,
  RiBarChartGroupedLine, // Better for Analytics
  RiSettings4Line,
  RiGroupLine,
  RiNotification3Line,
  RiPaintBrushFill
} from "react-icons/ri"; 
import Logo from "./AdminLogo";
import { useAuth } from "../../../context/AuthContext";
export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const {user} = useAuth();
  // Grouped menu structure for better UX
  const menuGroups = [
    {
      group: "Main",
      items: [
        { to: '/admin', label: 'Dashboard', icon: <RiDashboardLine /> },
        { to: '/admin/analytics', label: 'Analytics', icon: <RiBarChartGroupedLine />, badge: "Live" },
      ]
    },
    {
      group: "Content Management",
      items: [
        { to: '/admin/novels', label: 'Novels', icon: <RiBookLine /> },
        { to: '/admin/requests', label: 'Users', icon: <RiMailSendLine />, count: 5 },
      ]
    },
    {
      group: "System",
      items: [
        { to: '/admin/activity', label: 'Activity', icon: <RiHistoryLine /> },
        { to: '/admin/appearance', label: 'Appearance', icon: <RiLayoutLine /> },
        { to: '/admin/audit', label: 'Audit Logs', icon: <RiShieldLine /> },
      ]
    }
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-secondary)] border-r border-[var(--border)] p-5 flex flex-col transition-all duration-300 ease-in-out
      md:relative md:translate-x-0 
      ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
    `}>
      
      {/* Header with improved spacing */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Logo />
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 rounded-full hover:bg-[var(--bg-primary)] text-[var(--text-dim)]"
        >
          <RiCloseLine size={24} />
        </button>
      </div>
      
      {/* Scrollable Navigation Area */}
      <nav className="flex-1 overflow-y-auto space-y-8 scrollbar-hide">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)] opacity-50">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`
                      group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200
                      ${isActive 
                        ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-muted)]" 
                        : "text-[var(--text-dim)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-main)]"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xl ${isActive ? "text-white" : "group-hover:text-[var(--accent)] transition-colors"}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>

                    {/* Notification badges or indicators */}
                    {item.count && !isActive && (
                      <span className="bg-[var(--accent-muted)] text-[var(--accent)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Profile/Action Section */}
      <div className="mt-auto pt-6 border-t border-[var(--border)] space-y-4">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent)] to-purple-500 flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user.username}</p>
            <p className="text-[10px] text-[var(--text-dim)] truncate">Super Administrator</p>
          </div>
          <RiNotification3Line className="text-[var(--text-dim)] cursor-pointer hover:text-[var(--accent)]" />
        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] text-[var(--text-dim)] border border-[var(--border)] font-bold text-xs hover:border-red-400 hover:text-red-400 transition-all duration-300"
        >
          <RiLogoutBoxRLine size={18} /> Exit System
        </Link>
      </div>
    </aside>
  );
}