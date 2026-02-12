import React, { useState, useEffect } from "react";
import { FaTrash, FaCheckDouble, FaBell, FaCommentDots, FaHeart, FaPlusCircle, FaChevronRight } from "react-icons/fa";
import { notificationApi } from "../api/notificationApi";
import { Link, useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, id = null) => {
    try {
      if (action === "read") {
        await notificationApi.markAsRead(id);
        setNotifications(prev => 
          prev.map(n => (id ? (n._id === id ? { ...n, isRead: true } : n) : { ...n, isRead: true }))
        );
      } else if (action === "clear") {
        if (!window.confirm("Permanently delete all notifications?")) return;
        await notificationApi.clearAll();
        setNotifications([]);
      }
    } catch (err) { 
      console.error(`Action ${action} failed:`, err); 
    }
  };

  const navigateToSource = async (notification) => {
    // Mark as read automatically when navigating
    if (!notification.isRead) {
      handleAction("read", notification._id);
    }

    const path = notification.type === 'NEW_CHAPTER' 
      ? `/novel/${notification.novelId?._id}/chapter/${notification.chapterId}` 
      : `/novel/${notification.novelId?._id}`;
    
    navigate(path);
  };

  const filteredNotifications = notifications.filter(n => filter === "ALL" || n.type === filter);

  const getIcon = (type) => {
    switch (type) {
      case 'REPLY': return <FaCommentDots className="text-blue-500" />;
      case 'LIKE': return <FaHeart className="text-red-500" />;
      case 'NEW_CHAPTER': return <FaPlusCircle className="text-green-500" />;
      default: return <FaBell className="text-[var(--accent)]" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-main)] uppercase tracking-tight">Inbox</h1>
            <p className="text-sm text-[var(--text-dim)]">
              You have <span className="text-[var(--accent)] font-bold">{notifications.filter(n => !n.isRead).length}</span> unread updates.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleAction("read")}
              disabled={!notifications.some(n => !n.isRead)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase text-[var(--text-main)] hover:border-[var(--accent)] transition-all disabled:opacity-50"
            >
              <FaCheckDouble /> Mark All Read
            </button>
            <button 
              onClick={() => handleAction("clear")}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase text-red-500 hover:bg-red-500 transition-all hover:text-white"
            >
              <FaTrash /> Clear All
            </button>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {["ALL", "REPLY", "LIKE", "NEW_CHAPTER"].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === t 
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                : "bg-[var(--bg-secondary)] text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--text-dim)]"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-2xl">
          {loading ? (
            <div className="divide-y divide-[var(--border)]/50">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-6 animate-pulse flex gap-4">
                  <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-[var(--bg-primary)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--bg-primary)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-24 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--border)]">
                <FaBell size={40} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">All caught up!</h3>
              <p className="text-sm text-[var(--text-dim)] max-w-xs">No notifications found for this category.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]/50">
              {filteredNotifications.map((n) => (
                <div 
                  key={n._id} 
                  onClick={() => navigateToSource(n)}
                  className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-6 cursor-pointer hover:bg-[var(--bg-primary)]/80 transition-all relative ${!n.isRead ? 'bg-[var(--accent)]/5' : ''}`}
                >
                  {!n.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]" />
                  )}
                  
                  {/* Icon & User */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-xl w-8 flex justify-center">{getIcon(n.type)}</div>
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors flex items-center justify-center text-sm font-black uppercase text-[var(--accent)] overflow-hidden">
                      {n.sender?.avatar ? (
                        <img src={n.sender.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        n.sender?.username?.charAt(0) || 'S'
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-[var(--text-main)] leading-relaxed">
                      <span className="font-black text-[var(--accent)]">{n.sender?.username || "System"}</span>
                      <span className="mx-1">
                        {n.type === 'REPLY' ? 'replied to your comment in' : n.type === 'LIKE' ? 'liked your comment in' : n.type === 'EARNING' ? 'purchased a chapter of' : 'published a new chapter for'}
                      </span>
                      <span className="font-bold underline decoration-[var(--border)] group-hover:decoration-[var(--accent)]">
                         {n.novelId?.title}
                      </span>
                    </div>
                    
                    {n.commentId?.content && (
                       <div className="mt-3 p-3 bg-[var(--bg-primary)]/50 rounded-xl text-xs text-[var(--text-dim)] italic border border-[var(--border)] line-clamp-2">
                         "{n.commentId.content}"
                       </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[9px] text-[var(--text-dim)] uppercase tracking-tighter font-bold">
                         {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Chevron indicator */}
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[var(--accent)]">
                    <FaChevronRight />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;