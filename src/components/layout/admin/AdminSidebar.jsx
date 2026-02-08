import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaInbox, FaUser, FaPenNib, FaPalette, FaTimes, FaEdit, FaArrowLeft } from "react-icons/fa";
import Logo from "./AdminLogo";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { to: '/admin', label: 'HOME', icon: <FaHome /> },
    { to: '/admin/novels', label: 'NOVELS', icon: <FaBook /> },
    { to: '/admin/requests', label: 'REQUESTS', icon: <FaInbox /> },
    { to: '/admin/activity', label: 'ACTIVITY', icon: <FaPenNib /> },
    { to: '/admin/appearance', label: 'APPEARANCE', icon: <FaPalette /> },
  ];

  // Logic to handle poor readability in light themes:
  // We use var(--bg-secondary) with a low opacity for the glass effect 
  // and var(--border) to define the edge clearly.
  const glassStyle = "bg-[var(--bg-secondary)]/60 backdrop-blur-xl border-r border-[var(--border)] shadow-2xl";

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 ${glassStyle} p-6 flex flex-col transition-transform duration-500 ease-in-out
      md:relative md:translate-x-0 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      {/* Background Decorative Glow - uses theme accent */}
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-12 px-2">
        <Logo />
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>
      
      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? "bg-[var(--accent)] text-white shadow-lg border border-[var(--accent)]" 
                  : "text-[var(--text-dim)] hover:bg-[var(--accent)]/10 hover:text-[var(--text-main)]"}
              `}
            >
              <span className={`text-lg transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
              </span>
              <span className="font-bold text-[11px] tracking-[0.15em] uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section with Back Button */}
      <div className="mt-auto pt-6 border-t border-[var(--border)]">
        <Link
          to="/"
          className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-bold text-[10px] tracking-widest uppercase hover:bg-[var(--accent)] hover:text-white transition-all active:scale-95 shadow-lg"
        >
          <FaArrowLeft size={10} /> Exit Admin Panel
        </Link>
      </div>
    </aside>
  );
}