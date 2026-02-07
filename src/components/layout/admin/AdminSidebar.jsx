import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaInbox, FaUser, FaPenNib, FaPalette, FaTimes, FaEdit } from "react-icons/fa";
import Logo from "./AdminLogo";
export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const menuItems = [
    { to: '/admin', label: 'HOME', icon: <FaHome /> },
    { to: '/admin/novels', label: 'NOVELS', icon: <FaBook /> },
    { to: '/admin/requests', label: 'REQUESTS', icon: <FaInbox /> },
    { to: '/admin/users', label: 'USERS', icon: <FaUser /> },
    { to: '/admin/activity', label: 'OPERATIONS', icon: <FaPenNib /> },
    { to: '/admin/appearance', label: 'APPEARANCE', icon: <FaPalette /> },
    { to: '/admin/logs', label: 'MODIFICATIONS', icon: <FaEdit /> },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-indigo-950 p-4 flex flex-col transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}>
      {/* Close button for mobile */}
      <div className="flex items-center justify-between mb-10 px-2">
        <Logo/>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-indigo-300 hover:text-white"
        >
          <FaTimes size={20} />
        </button>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)} // Close menu on click (mobile)
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-lg" 
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}