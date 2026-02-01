import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";

export default function MainLayout({ currentTheme, setTheme }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < lastScrollY.current || currentY < 80) {
        // scrolling UP or near top
        setShowNavbar(true);
      } else {
        // scrolling DOWN
        setShowNavbar(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // We use the dynamic background variable here as well
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] transition-colors duration-500">
      
      {/* Passing theme props to Navbar */}
      <Navbar 
        show={showNavbar} 
        currentTheme={currentTheme} 
        setTheme={setTheme} 
      />

      {/* Main content area */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}