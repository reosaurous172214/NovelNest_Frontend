import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./ScrollUpTo";
import { AuthProvider } from "./context/AuthContext";

function App() {
  // Initialize theme from localStorage or default to amoled
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("site-theme") || "default",
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // 1. Remove EVERY possible theme class first
    root.classList.remove(
      "theme-cyberpunk",
      "theme-emerald",
      "theme-light",
      "theme-cream",
    );

    // 2. Add the selected theme class
    // Even for 'default', we ensure the body background follows the variable
    if (currentTheme !== "default") {
      root.classList.add(`theme-${currentTheme}`);
    }

    // 3. Persist the choice
    localStorage.setItem("site-theme", currentTheme);
  }, [currentTheme]);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        {/* We wrap the app in a div that uses our CSS variables. 
            'transition-colors' ensures themes bleed into each other smoothly.
        */}
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-500 ease-in-out">
          <AppRoutes currentTheme={currentTheme} setTheme={setCurrentTheme} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
