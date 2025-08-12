import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import useNotifications from '../hooks/useNotifications';
import useSocket from '../hooks/useSocket';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { items, unreadCount, reload, markAsRead, markAllAsRead } = useNotifications({ pageSize: 10 });
  const { messages } = useSocket();
  const [toasts, setToasts] = useState([]);

  // When real-time message arrives, show toast
  useEffect(() => {
    if (!messages || !messages.length) return;
    const latest = messages[0];
    setToasts((t) => [latest, ...t].slice(0, 3));
  }, [messages]);

  const value = useMemo(() => ({ items, unreadCount, reload, markAsRead, markAllAsRead, toasts, setToasts }), [items, unreadCount, reload, markAsRead, markAllAsRead, toasts]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCenter() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationCenter must be used within NotificationProvider');
  return ctx;
}


