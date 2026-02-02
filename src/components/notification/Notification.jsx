import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTrash, FaCircle, FaCheckDouble } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { notificationApi } from '../../api/notificationApi';

const NotificationBar = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Load notifications and handle click-outside
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Optional: Set up polling every 60 seconds for new updates
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const closeMenu = (e) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false); 
      }
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(data || []);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  const handleAction = async (action, id = null) => {
    try {
      if (action === 'read') {
        await notificationApi.markAsRead(id);
        setNotifications(prev => 
          prev.map(n => id ? (n._id === id ? { ...n, isRead: true } : n) : { ...n, isRead: true })
        );
      } else if (action === 'clear') {
        if (!window.confirm("Clear all notifications?")) return;
        await notificationApi.clearAll();
        setNotifications([]);
      }
    } catch (err) { 
      console.error("Action Error:", err); 
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL TRIGGER */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`relative p-2 transition-all active:scale-90 rounded-full hover:bg-[var(--bg-secondary)] ${
          isOpen ? 'text-[var(--accent)] bg-[var(--bg-secondary)]' : 'text-[var(--text-dim)]'
        }`}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN BODY */}
      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm sm:hidden z-[-1]" onClick={() => setIsOpen(false)} />
          
          <div 
            className="fixed sm:absolute top-20 sm:top-full left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 mt-3 w-[92vw] sm:w-80 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* HEADER */}
            <div className="p-5 border-b border-[var(--border)]/50 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">Activity</h4>
                <p className="text-[10px] text-[var(--text-dim)] font-medium">
                  {unreadCount} unread updates
                </p>
              </div>
              <div className="flex gap-3 text-[var(--text-dim)]">
                <button 
                  onClick={() => handleAction('read')} 
                  disabled={unreadCount === 0}
                  className="p-2 hover:text-[var(--accent)] transition-colors disabled:opacity-30" 
                  title="Mark all read"
                >
                  <FaCheckDouble size={14}/>
                </button>
                <button 
                  onClick={() => handleAction('clear')} 
                  className="p-2 hover:text-red-500 transition-colors" 
                  title="Clear all"
                >
                  <FaTrash size={12}/>
                </button>
              </div>
            </div>

            {/* LIST */}
            <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto no-scrollbar bg-[var(--bg-secondary)]">
              {notifications.length === 0 ? (
                <div className="py-16 px-8 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--border)]">
                    <FaBell size={20} />
                  </div>
                  <p className="text-xs text-[var(--text-dim)] font-bold italic">Everything is quiet...</p>
                </div>
              ) : (
                notifications.map(n => (
                  <Link 
                    to={n.type === 'NEW_CHAPTER' ? `/novel/${n.novelId?._id}/chapter/${n.chapterId}` : `/novel/${n.novelId?._id}`} 
                    key={n._id}
                    onClick={() => { handleAction('read', n._id); setIsOpen(false); }}
                    className={`flex items-start gap-4 p-4 border-b border-[var(--border)]/20 hover:bg-[var(--bg-primary)] transition-all relative ${!n.isRead ? 'bg-[var(--accent)]/[0.03]' : ''}`}
                  >
                    {/* Visual Indicator for Unread */}
                    {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]" />}

                    {/* Sender Initial/Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex-shrink-0 flex items-center justify-center text-xs font-black text-[var(--accent)] uppercase shadow-sm">
                      {n.sender?.username?.charAt(0) || 'S'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-[var(--text-main)] leading-relaxed">
                        <span className="font-black">{n.sender?.username || "System"}</span> 
                        <span className="text-[var(--text-dim)] mx-1">
                          {n.type === 'REPLY' ? 'replied to' : n.type === 'LIKE' ? 'liked' : 'updated'}
                        </span>
                        <span className="font-bold text-[var(--accent)] truncate block">
                           {n.novelId?.title}
                        </span>
                      </div>
                      
                      {n.commentId?.content && (
                         <p className="mt-1 text-[10px] text-[var(--text-dim)] italic line-clamp-1 opacity-80">
                           "{n.commentId.content}"
                         </p>
                      )}
                      
                      <span className="text-[8px] text-[var(--text-dim)] mt-2 block uppercase font-bold tracking-widest">
                          {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {!n.isRead && (
                      <div className="self-center shrink-0">
                        <FaCircle className="text-[var(--accent)] animate-pulse" size={6} />
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>

            {/* FOOTER */}
            <Link 
              to="/notifications" 
              className="block p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white bg-[var(--accent)] hover:brightness-110 transition-all"
            >
              Open Full Inbox
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBar;