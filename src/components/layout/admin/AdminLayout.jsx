import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./AdminSidebar.jsx";
import { LuMenu, LuCircleUser, LuChevronRight } from "react-icons/lu";
// Assuming you have an AuthContext to get real user data
import { useAuth } from "../../../context/AuthContext"; 

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth(); // Accessing real admin data

  // Breadcrumb logic
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Profile Picture Logic consistent with your Ledger theme
  const renderAdminAvatar = () => {
    if (!user?.profilePicture) {
      return <LuCircleUser className="text-white" size={20} />;
    }

    const isExternal = user.profilePicture.startsWith('http');
    const imgSrc = isExternal 
      ? user.profilePicture 
      : `${process.env.REACT_APP_API_URL}${user.profilePicture}`;

    return (
      <img 
        src={imgSrc} 
        alt="Admin" 
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] font-sans antialiased text-[var(--text-main)] transition-colors duration-500">
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-hidden">
        
        {/* OFFICIAL UTILITY HEADER */}
        <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between px-4 md:px-8 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-md hover:bg-[var(--bg-primary)] md:hidden text-[var(--text-dim)] transition-colors border border-[var(--border)]"
            >
              <LuMenu size={22} />
            </button>
            
            <nav className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-dim)]">
              <span className="hover:text-[var(--text-main)] cursor-default">System</span>
              {pathnames.map((name, index) => (
                <div key={name + index} className="flex items-center gap-2">
                  <LuChevronRight size={14} className="text-[var(--border)]" />
                  <span className={index === pathnames.length - 1 ? "text-[var(--accent)]" : ""}>
                    {name.replace(/-/g, " ")}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* REAL USER DATA SECTION */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-[1px] bg-[var(--border)] hidden sm:block" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden md:block">
                {/* Real Username displayed here */}
                <p className="text-[10px] font-bold uppercase tracking-tighter text-[var(--text-dim)] leading-none">
                  Authenticated As
                </p>
                <p className="text-xs font-bold text-[var(--text-main)]">
                  {user?.username || "Administrator"}
                </p>
              </div>
              
              {/* Profile Picture with real data logic */}
              <div className="w-9 h-9 rounded-lg bg-[var(--accent)] overflow-hidden flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 border border-[var(--border)] transition-transform active:scale-95 cursor-pointer">
                {renderAdminAvatar()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8 lg:p-10 animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>

        <footer className="h-8 border-t border-[var(--border)] bg-[var(--bg-secondary)] px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-dim)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Core Systems Online
            </span>
          </div>
          <div className="hidden sm:block">
            Administrative Console v2.0.4
          </div>
        </footer>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}