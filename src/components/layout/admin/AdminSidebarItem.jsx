// SidebarItem.js
import { Link } from "react-router-dom";
export default function SidebarItem({to, icon, label, active = false }) {
    return (
        <Link to={to} className={`
            flex items-center cursor-pointer transition-all duration-200
            px-4 py-3 rounded-xl gap-4 mb-1
            ${active 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200/20" 
                : "text-indigo-200 hover:bg-white/10 hover:text-white"}
        `}>
            <div className={`text-xl ${active ? "text-white" : "text-indigo-400"}`}>
                {icon}
            </div>
            <span className="font-medium text-sm md:text-base whitespace-nowrap">
                {label}
            </span>
        </Link>
    );
}