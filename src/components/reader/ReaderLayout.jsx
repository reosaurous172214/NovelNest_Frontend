import { useState } from "react";
import MenuBar from "./MenuBar";
export default function ReaderLayout({ children, themeClass, fontClass, settings, setSettings }) {
  const [showMenu, setShowMenu] = useState(false);

  // Toggle menu when clicking the center of the screen
  const handleToggleMenu = (e) => {
    // Only toggle if the user isn't clicking a button or a link
    if (e.target.tagName === "DIV" || e.target.tagName === "ARTICLE") {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div 
      className={`${themeClass} ${fontClass} min-h-screen transition-all duration-500 pt-24`}
      onClick={handleToggleMenu}
    >
      {/* Top and Bottom Menu Bars */}
      <div className="mx-auto max-w-2xl px-5 py-10">
        {children}
      </div>
      <MenuBar className="relative" isVisible={showMenu} settings={settings} setSettings={setSettings} />
    </div>
  );
}