import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./ScrollUpTo";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

function App(){
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        {/* We wrap the app in a div that uses our CSS variables. 
            'transition-colors' ensures themes bleed into each other smoothly.
        */}
        <NotificationProvider>
          <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-500 ease-in-out">
            <AppRoutes  />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
