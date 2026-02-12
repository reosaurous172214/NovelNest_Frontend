import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaHome, FaBook, FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes, 
  FaSearch, FaChevronDown, FaUserCircle, FaBookmark, FaUser, FaShieldAlt, FaCog, FaArrowRight,
  FaWallet
} from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import Logo from "./Logo";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import NotificationBar from "../notification/Notification";

const Navbar = ({ show, scrolled: propScrolled }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* --- SEARCH STATES --- */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e) => {
      // Close profile if clicking outside
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      // Close search if clicking outside the search container
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* --- SEARCH LOGIC --- */
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/suggest?q=${searchQuery}`);
          setSearchResults(res.data);
          setSearchOpen(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // FIXED: Using onMouseDown handler to beat the 'blur' event race
  const handleResultNavigation = (e, novelId) => {
    e.preventDefault(); // Prevents input from blurring immediately
    e.stopPropagation(); 
    
    navigate(`/novel/${novelId}`);
    
    // Close UI elements after a tiny delay
    setTimeout(() => {
      setSearchOpen(false);
      setSearchQuery("");
      setMenuOpen(false);
    }, 50);
  };

  const handleLogout = () => {
    showAlert("Logged out successfully", "info");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/novels?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const userInitial = user?.username?.charAt(0).toUpperCase() || "U";
  const profileImg = user?.profilePicture ? `${process.env.REACT_APP_API_URL}${user.profilePicture}` : null;

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${show ? "translate-y-0" : "-translate-y-full"} ${scrolled ? "pt-2" : "pt-4"}`}>
      
      <div className={`mx-auto px-4 w-full transition-all duration-500 ${scrolled ? "max-w-[95%]" : "max-w-[98%]"}`}>
        
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg rounded-[2rem] px-4 md:px-8 py-2.5 flex items-center justify-between gap-2 md:gap-6 backdrop-blur-3xl">
          
          <Link to="/" className="shrink-0 scale-90 md:scale-100">
            <Logo />
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden lg:flex flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={onSearchSubmit} className="w-full relative group">
              <input
                type="text"
                placeholder="Search novels..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl px-11 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
              />
              <FaSearch className={`absolute left-4 top-3.5 transition-colors ${isSearching ? "text-[var(--accent)] animate-pulse" : "text-[var(--text-dim)]"}`} />
            </form>

            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[1.5rem] shadow-2xl overflow-hidden z-[110] backdrop-blur-3xl">
                <div className="p-2 max-h-80 overflow-y-auto no-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((novel, index) => (
                      <div 
                        key={`dt-res-${novel.id || novel._id}-${index}`} 
                        onMouseDown={(e) => handleResultNavigation(e, novel.id || novel._id)} 
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--accent)]/10 transition-all group cursor-pointer"
                      >
                        <img 
                          src={novel.cover?.startsWith('http') ? novel.cover : `${process.env.REACT_APP_API_URL}${novel.cover}`} 
                          className="w-8 h-12 object-cover rounded-lg border border-[var(--border)]" 
                          alt="" 
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[11px] font-black text-[var(--text-main)] truncate uppercase group-hover:text-[var(--accent)]">
                            {novel.title}
                          </p>
                        </div>
                        <FaArrowRight size={10} className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[10px] text-[var(--text-dim)] font-bold uppercase">No results found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <NavItem to="/" icon={<FaHome />} label="Home" active={location.pathname === "/"} />
              <NavItem to="/novels" icon={<FaBook />} label="Explore" active={location.pathname === "/novels"} />
              <NavItem to="/library" icon={<IoLibrary />} label="Library" active={location.pathname === "/library"} />
            </div>

            <div className="h-6 w-[1px] bg-[var(--border)] hidden md:block"></div>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-[10px] font-bold text-[var(--text-dim)] hover:text-[var(--text-main)] uppercase tracking-widest hidden sm:block">Login</Link>
                <Link to="/register" className="bg-[var(--accent)] px-4 md:px-5 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">Join</Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <NotificationBar currentUser={user} />

                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1 md:pr-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl transition-all">
                    {profileImg ? (
                      <img src={profileImg} alt="" className="w-8 h-8 rounded-xl object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white text-xs">{userInitial}</div>
                    )}
                    <span className="hidden lg:block text-xs font-bold text-[var(--text-main)] truncate max-w-[80px]">{user?.username}</span>
                    <FaChevronDown size={10} className={`text-[var(--text-dim)] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-[110]">
                      <div className="p-2">
                        <DropdownItem to="/dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
                        <DropdownItem to="/profile" icon={<FaUserCircle />} label="My Profile" />
                        <DropdownItem to="/library" icon={<FaBookmark />} label="My Library" />
                        <DropdownItem to="/settings" icon={<FaCog />} label="Settings" />
                        <DropdownItem to="/wallet" icon = {<FaWallet/>} label = "Wallet"/>
                        {user?.role === 'admin' && <DropdownItem to="/admin" icon={<FaShieldAlt />} label="Admin Panel" />}
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase mt-1 border-t border-[var(--border)]">
                          <FaSignOutAlt  size={18}/> Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button className="md:hidden p-2.5 rounded-xl bg-[var(--bg-primary)] text-[var(--text-main)] border border-[var(--border)] active:scale-90" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`fixed inset-x-4 top-20 p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2rem] md:hidden shadow-2xl transition-all duration-300 origin-top z-[120] max-h-[85vh] overflow-y-auto ${menuOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-4 pointer-events-none"}`}>
        
        <div className="relative mb-6">
          <form onSubmit={onSearchSubmit}>
            <input
              type="text"
              placeholder="Search novels..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl px-12 py-3.5 text-sm text-[var(--text-main)] focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
            />
            <FaSearch className={`absolute left-5 top-4 ${isSearching ? "text-[var(--accent)] animate-pulse" : "text-[var(--text-dim)]"}`} />
          </form>

          {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden z-[130]">
                <div className="p-2 max-h-60 overflow-y-auto no-scrollbar">
                  {searchResults.map((novel, index) => (
                    <div 
                      key={`mb-res-${novel.id || novel._id}-${index}`} 
                      onMouseDown={(e) => handleResultNavigation(e, novel.id || novel._id)} 
                      className="flex items-center gap-3 p-3 hover:bg-[var(--accent)]/10 rounded-xl cursor-pointer"
                    >
                      <img src={novel.cover?.startsWith('http') ? novel.cover : `${process.env.REACT_APP_API_URL}${novel.cover}`} className="w-8 h-10 object-cover rounded" alt="" />
                      <span className="text-xs font-bold text-[var(--text-main)] truncate">{novel.title}</span>
                    </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <MobileNavItem to="/" icon={<FaHome />} label="Home" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/novels" icon={<FaBook />} label="Explore" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/library" icon={<IoLibrary />} label="Library" onClick={() => setMenuOpen(false)} />
          {isAuthenticated && (
            <>
              <MobileNavItem to="/dashboard" icon={<FaTachometerAlt />} label="Dashboard" onClick={() => setMenuOpen(false)} />
              <MobileNavItem to="/profile" icon={<FaUser />} label="Profile" onClick={() => setMenuOpen(false)} />
              <MobileNavItem to="/settings" icon={<FaCog />} label="Settings" onClick={() => setMenuOpen(false)} />
            </>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="flex gap-3">
            <Link to="/login" className="flex-1 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl text-center font-bold text-xs uppercase text-[var(--text-main)]" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="flex-1 py-4 bg-[var(--accent)] rounded-2xl text-center font-black text-xs uppercase text-white shadow-lg" onClick={() => setMenuOpen(false)}>Join</Link>
          </div>
        ) : (
          <button onClick={handleLogout} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase border border-red-500/20">Sign Out</button>
        )}
      </div>
    </nav>
  );
};

/* --- SUB-COMPONENTS --- */
const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl transition-all group ${active ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)]"}`}>
    <span className="text-sm">{icon}</span>
    <span className="text-[12px] font-semibold uppercase tracking-widest">{label}</span>
  </Link>
);

const DropdownItem = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-2.5 text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--accent)]/10 rounded-xl transition-all text-[11px] font-semibold uppercase  group">
    <span>{icon}</span> {label}
  </Link>
);

const MobileNavItem = ({ to, icon, label, onClick }) => (
  <Link to={to} onClick={onClick} className="flex flex-col items-center justify-center p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl text-[var(--text-dim)] active:bg-[var(--accent)] active:text-white transition-all">
    <span className="text-xl mb-1 text-[var(--accent)]">{icon}</span>
    <span className="text-[9px] font-black uppercase">{label}</span>
  </Link>
);

export default Navbar;