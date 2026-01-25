import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaBook,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import Logo from './Logo';
// --- ADVANCED CREATIVE LOGO COMPONENT ---
// const CreativeLogo = () => (
//   <div className="relative flex items-center justify-center w-11 h-11 group">
//     {/* Animated Glow Background */}
//     <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full group-hover:bg-blue-400/40 transition-all duration-500"></div>

//     {/* The Glass Shard (Back) */}
//     <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg -rotate-12 group-hover:rotate-0 transition-transform duration-500"></div>

//     {/* The Main Hub (Front) */}
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40 backdrop-blur-lg border border-white/30 rounded-lg rotate-6 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-xl">
//       <svg viewBox="0 0 24 24" className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" fill="none" stroke="currentColor" strokeWidth="2.5">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
//       </svg>
//     </div>
//   </div>
// );

const Navbar = ({ show }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/novels?query=${encodeURIComponent(searchQuery)}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 ease-in-out ${show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      {/* Main Bar */}
      <div className="mx-4 mt-2 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] rounded-3xl transition-all">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          {/* Updated Brand Section for the Kingly Logo */}
          {/* Updated Brand Section - Regal & Seamless */}
          <Link to="/" className="flex items-center group">
            <Logo/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={onSearchSubmit} className="relative group">
              <input
                type="text"
                placeholder="Find your next world..."
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-56 lg:w-72 transition-all placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute right-4 top-3 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            </form>

            <div className="flex items-center space-x-4">
              <NavItem to="/" icon={<FaHome />} label="Home" />
              <NavItem to="/novels" icon={<FaBook />} label="Explore" />
              <NavItem to="/library" icon={<IoLibrary />} label="Library" />

              <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-gray-300 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-6 py-2 rounded-2xl text-sm font-bold transition shadow-lg shadow-blue-900/40"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavItem
                    to="/dashboard"
                    icon={<FaTachometerAlt />}
                    label="Admin"
                  />
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  >
                    <FaSignOutAlt size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/5 text-white active:scale-90 transition-transform"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`
        absolute top-full left-4 right-4 mt-3 p-5 
        bg-gray-950/90 backdrop-blur-3xl border border-white/10 rounded-3xl 
        md:hidden flex flex-col space-y-5 shadow-2xl transition-all duration-300 origin-top
        ${menuOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"}
      `}
      >
        {/* Mobile Search - ALWAYS VISIBLE ON MOBILE MENU */}
        <form onSubmit={onSearchSubmit} className="relative group">
          <input
            type="text"
            placeholder="Search novels, authors..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-5 top-4 text-blue-400" />
        </form>

        <div className="grid grid-cols-2 gap-3">
          <MobileNavItem
            to="/"
            icon={<FaHome />}
            label="Home"
            onClick={() => setMenuOpen(false)}
          />
          <MobileNavItem
            to="/novels"
            icon={<FaBook />}
            label="Explore"
            onClick={() => setMenuOpen(false)}
          />
          <MobileNavItem
            to="/library"
            icon={<IoLibrary />}
            label="My Library"
            onClick={() => setMenuOpen(false)}
          />
          {isAuthenticated && (
            <MobileNavItem
              to="/dashboard"
              icon={<FaTachometerAlt />}
              label="Dashboard"
              onClick={() => setMenuOpen(false)}
            />
          )}
        </div>

        <hr className="border-white/5" />

        <div className="flex items-center justify-between pt-2">
          {!isAuthenticated ? (
            <div className="flex w-full space-x-3">
              <Link
                to="/login"
                className="flex-1 text-center py-3 bg-white/5 rounded-2xl text-white font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-3 bg-blue-600 rounded-2xl text-white font-bold"
                onClick={() => setMenuOpen(false)}
              >
                Join
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-3 w-full py-3 bg-red-500/10 text-red-400 rounded-2xl font-bold"
            >
              <FaSignOutAlt /> <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- REUSABLE SUB-COMPONENTS ---
const NavItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-400 hover:text-white group transition-all duration-300"
  >
    <span className="text-lg group-hover:scale-110 transition-transform text-blue-400/80 group-hover:text-blue-400">
      {icon}
    </span>
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </Link>
);

const MobileNavItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 text-gray-300 active:bg-blue-600/20 active:border-blue-500/40"
  >
    <span className="text-2xl text-blue-400 mb-1">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-tighter">
      {label}
    </span>
  </Link>
);

export default Navbar;
