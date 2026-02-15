import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // 1. Wrap in useCallback so the function reference stays stable
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationApi.getAll();
      const notifs = data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Context Fetch Error:", err);
    }
  }, [user]); // Only recreates if the user changes

  // 2. Now 'fetchNotifications' is a safe dependency
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refresh = () => fetchNotifications();

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);