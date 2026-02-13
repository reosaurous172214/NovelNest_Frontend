import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  RiHome4Line, RiBook3Line, RiLogoutBoxRLine, RiDashboardLine, RiMenu4Line, RiCloseLine, 
  RiSearchLine, RiArrowRightSLine, RiUserLine, RiSettings4Line, RiShieldFlashLine, RiWallet3Line, RiBookmarkLine
} from "react-icons/ri";
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
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const { user } = useAuth();

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${process.env.REACT_APP_API_URL}${path}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || mobileSearchActive) ? "hidden" : "unset";
  }, [menuOpen, mobileSearchActive]);

  /* --- SEARCH LOGIC --- */
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 1) {
        setIsSearching(true);
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/suggest?q=${searchQuery}`);
          setSearchResults(res.data);
          setSearchOpen(true);
        } catch (err) { console.error(err); }
        finally { setIsSearching(false); }
      } else {
        setSearchResults([]);
        setSearchOpen(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultNavigation = (e, novelId) => {
    e.preventDefault();
    navigate(`/novel/${novelId}`);
    setSearchOpen(false);
    setSearchQuery("");
    setMenuOpen(false);
    setMobileSearchActive(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate("/login");
    showAlert("Logged out successfully", "info");
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/novels?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setMobileSearchActive(false);
    }
  };

  const userInitial = user?.username?.charAt(0).toUpperCase() || "U";
  const profileImg = user?.profilePicture ? getImageUrl(user.profilePicture) : null;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 antialiased ${show ? "translate-y-0" : "-translate-y-full"} ${scrolled ? "pt-2" : "pt-4"}`}>
        <div className={`mx-auto px-4 w-full transition-all duration-500 ${scrolled ? "max-w-[95%]" : "max-w-[98%]"}`}>
          
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] shadow-lg rounded-[2rem] px-4 md:px-8 py-2.5 flex items-center justify-between backdrop-blur-3xl relative h-[65px]">
            
            {!mobileSearchActive && (
              <Link to="/" className="shrink-0 scale-90 md:scale-100 transition-transform active:scale-95">
                <Logo />
              </Link>
            )}

            {/* UNIFIED SEARCH COMPONENT */}
            <div 
              ref={searchRef}
              className={`
                ${mobileSearchActive 
                  ? "absolute inset-x-3 inset-y-2 flex items-center bg-[var(--bg-secondary)] rounded-[1.5rem] z-[110] px-2" 
                  : "hidden lg:flex flex-1 max-w-xl mx-6 relative"}
              `}
            >
              <form onSubmit={onSearchSubmit} className="w-full relative">
                <input
                  autoFocus={mobileSearchActive}
                  type="text"
                  placeholder="Search novels..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl px-11 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40 transition-all font-semibold tracking-tight"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 1 && setSearchOpen(true)}
                />
                <RiSearchLine className={`absolute left-4 top-1/2 -translate-y-1/2 ${isSearching ? "text-[var(--accent)] animate-pulse" : "text-[var(--text-dim)]"}`} />
                
                {mobileSearchActive && (
                  <button 
                    type="button" 
                    onClick={() => {setMobileSearchActive(false); setSearchOpen(false);}}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text-main)]"
                  >
                    <RiCloseLine size={18} />
                  </button>
                )}
              </form>

              {/* SEARCH RESULTS DROPDOWN */}
              {searchOpen && (
                <div className="absolute top-[115%] left-0 right-0 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-[110] backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 max-h-[400px] overflow-y-auto no-scrollbar">
                    {searchResults.length > 0 ? (
                      searchResults.map((novel) => (
                        <div key={novel._id} onMouseDown={(e) => handleResultNavigation(e, novel.id || novel._id)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--accent)]/10 transition-all group cursor-pointer border border-transparent hover:border-[var(--border)]">
                          <img src={getImageUrl(novel.cover)} className="w-10 h-14 object-cover rounded-lg border border-[var(--border)] shadow-sm" alt="" />
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-semibold text-[var(--text-main)] uppercase truncate tracking-tight">{novel.title}</p>
                            <p className="text-[10px] text-[var(--text-dim)] uppercase font-semibold truncate tracking-widest opacity-70">{novel.author}</p>
                          </div>
                          <RiArrowRightSLine size={14} className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                        </div>
                      ))
                    ) : (
                      <div className="p-5 text-center text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-widest opacity-60">No matching records found</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className={`flex items-center gap-2 md:gap-4 ${mobileSearchActive ? "hidden" : "flex"}`}>
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <NavItem to="/" icon={<RiHome4Line />} label="Home" active={location.pathname === "/"} />
                <NavItem to="/novels" icon={<RiBook3Line />} label="Explore" active={location.pathname === "/novels"} />
                <NavItem to="/library" icon={<RiBookmarkLine />} label="Library" active={location.pathname === "/library"} />
              </div>

              <div className="h-6 w-[1px] bg-[var(--border)] hidden md:block mx-1"></div>

              <button className="lg:hidden p-2 text-[var(--text-main)] hover:bg-[var(--bg-primary)] rounded-xl transition-all" onClick={() => setMobileSearchActive(true)}>
                <RiSearchLine size={18} />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2 md:gap-3">
                  <NotificationBar currentUser={user} />
                  <div className="relative hidden md:block" ref={profileRef}>
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2.5 p-1 pr-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl transition-all hover:border-[var(--accent)]/50 active:scale-95">
                      {profileImg ? (
                        <img src={profileImg} alt="" className="w-8 h-8 rounded-xl object-cover shadow-sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shadow-sm">{userInitial}</div>
                      )}
                      <span className="hidden lg:block text-xs font-semibold text-[var(--text-main)] truncate max-w-[80px] tracking-tight">{user?.username}</span>
                      <RiArrowRightSLine size={12} className={`text-[var(--text-dim)] transition-transform rotate-90 ${profileOpen ? 'rotate-[270deg]' : ''}`} />
                    </button>
                    {profileOpen && (
                      <div className="absolute right-0 mt-3 w-60 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 space-y-0.5">
                          <DropdownItem to="/dashboard" icon={<RiDashboardLine />} label="Dashboard" />
                          <DropdownItem to="/profile" icon={<RiUserLine />} label="My Profile" />
                          <DropdownItem to="/library" icon={<RiBookmarkLine />} label="My Library" />
                          <DropdownItem to="/settings" icon={<RiSettings4Line />} label="Settings" />
                          <DropdownItem to="/wallet" icon={<RiWallet3Line />} label="Wallet" />
                          {user?.role === 'admin' && <DropdownItem to="/admin" icon={<RiShieldFlashLine />} label="Admin Panel" />}
                          <div className="h-[1px] bg-[var(--border)] my-1 mx-2 opacity-50"></div>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-semibold uppercase tracking-wider">
                            <RiLogoutBoxRLine size={16} /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-2">
                  <Link to="/register" className="hidden sm:block bg-[var(--accent)] px-5 py-2.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all">SignUp</Link>
                  <Link to="/login" className="hidden sm:block border border-[var(--border)] px-5 py-2.5 rounded-xl text-[10px] font-bold text-[var(--text-main)] uppercase tracking-widest hover:bg-[var(--bg-primary)] active:scale-95 transition-all">LogIn</Link>
                </div>
              )}

              <button className="md:hidden p-2.5 rounded-xl bg-[var(--bg-primary)] text-[var(--text-main)] border border-[var(--border)] transition-colors active:bg-[var(--bg-secondary)]" onClick={() => setMenuOpen(true)}>
                <RiMenu4Line size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] transition-opacity md:hidden ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setMenuOpen(false)} />
      
      <aside className={`fixed top-0 right-0 h-full w-[280px] bg-[var(--bg-secondary)] border-l border-[var(--border)] z-[160] transition-transform duration-400 md:hidden flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <Logo />
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-dim)] active:scale-90 transition-transform"><RiCloseLine size={20} /></button>
        </div>

        {isAuthenticated ? (
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="p-6 bg-[var(--bg-primary)]/40 border-b border-[var(--border)] block transition-colors hover:bg-[var(--bg-primary)]/60">
            <div className="flex items-center gap-4">
              {profileImg ? (
                <img src={profileImg} alt="" className="w-12 h-12 rounded-2xl object-cover border border-[var(--border)] shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white text-lg font-bold shadow-sm">{userInitial}</div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-[var(--text-main)] truncate tracking-tight">{user?.username}</p>
                <p className="text-[10px] font-semibold text-[var(--text-dim)] uppercase tracking-widest opacity-70">{user?.role || 'Reader'}</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-6 border-b border-[var(--border)] space-y-3">
             <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full py-4 border border-[var(--border)] rounded-2xl text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--text-main)]">Log In</Link>
             <Link to="/register" onClick={() => setMenuOpen(false)} className="block w-full py-4 bg-[var(--accent)] text-white rounded-2xl text-center text-[10px] font-semibold uppercase tracking-widest shadow-lg">Join NovelNest</Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          <div className="py-2 text-left">
            <p className="px-4 text-[9px] font-semibold text-[var(--text-dim)] uppercase tracking-[0.3em] mb-3 opacity-60">Navigation</p>
            <MobileSidebarItem to="/" icon={<RiHome4Line />} label="Home" onClick={() => setMenuOpen(false)} active={location.pathname === "/"} />
            <MobileSidebarItem to="/novels" icon={<RiBook3Line />} label="Explore" onClick={() => setMenuOpen(false)} />
            <MobileSidebarItem to="/library" icon={<RiBookmarkLine />} label="Library" onClick={() => setMenuOpen(false)} />
          </div>

          {isAuthenticated && (
            <div className="py-2 text-left">
              <p className="px-4 text-[9px] font-semibold text-[var(--text-dim)] uppercase tracking-[0.3em] mb-3 opacity-60">System</p>
              <MobileSidebarItem to="/dashboard" icon={<RiDashboardLine />} label="Dashboard" onClick={() => setMenuOpen(false)} />
              <MobileSidebarItem to="/wallet" icon={<RiWallet3Line />} label="Wallet" onClick={() => setMenuOpen(false)} />
              {user?.role === 'admin' && <MobileSidebarItem to="/admin" icon={<RiShieldFlashLine />} label="Admin Panel" onClick={() => setMenuOpen(false)} />}
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="p-4 border-t border-[var(--border)]">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/5 text-red-500 border border-red-500/10 rounded-2xl font-semibold text-[10px] uppercase tracking-widest transition-all active:scale-95">
              <RiLogoutBoxRLine size={16} /> Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

/* --- SUB-COMPONENTS --- */
const NavItem = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${active ? "bg-[var(--accent)]/10 text-[var(--accent)] shadow-sm" : "text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)]"}`}>
    <span className="text-sm">{icon}</span>
    <span className="text-[11px] font-semibold uppercase tracking-widest">{label}</span>
  </Link>
);

const DropdownItem = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-2.5 text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)] rounded-xl transition-all text-[11px] font-semibold uppercase tracking-tight">
    <span className="text-[15px]">{icon}</span> {label}
  </Link>
);

const MobileSidebarItem = ({ to, icon, label, onClick, active }) => (
  <Link to={to} onClick={onClick} className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${active ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" : "text-[var(--text-dim)] hover:bg-[var(--bg-primary)]"}`}>
    <span className="text-lg">{icon}</span>
    <span className="text-[11px] font-semibold uppercase tracking-widest">{label}</span>
  </Link>
);

export default Navbar;