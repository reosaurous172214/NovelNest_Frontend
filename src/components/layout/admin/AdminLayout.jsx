import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import { HiMenuAlt2 } from "react-icons/hi";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-500">
      
      {/* Sidebar - We pass the state to it */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="relative flex flex-col flex-1 overflow-hidden">
        
        {/* Responsive Header */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button - Only visible on small screens */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] md:hidden text-[var(--accent)]"
            >
              <HiMenuAlt2 size={24} />
            </button>
            
            <span className="hidden sm:inline text-[var(--text-dim)] font-medium text-sm">
              Admin / <span className="text-[var(--text-main)]">Control Panel</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for Mobile - Closes sidebar when clicking outside */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}