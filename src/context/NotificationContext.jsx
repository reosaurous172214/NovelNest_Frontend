import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationApi.getAll();
      setNotifications(data || []);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Context Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Use this function everywhere instead of local state logic
  const refresh = () => fetchNotifications();

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);