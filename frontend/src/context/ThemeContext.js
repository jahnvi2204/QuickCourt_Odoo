import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Bell, 
  BellRing,
  CreditCard,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Moon,
  Sun,
  Smartphone,
  Wifi,
  Car,
  Coffee,
  Shield,
  Camera,
  Upload,
  X,
  Plus,
  Minus
} from 'lucide-react';
import io from 'socket.io-client';

// ==========================================
// CONTEXT & HOOKS
// ==========================================

// Theme Context for Dark Mode
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// Socket Context for Real-time Features
const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        // Show toast notification
        showNotificationToast(notification);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token]);

  const showNotificationToast = (notification) => {
    // Implementation would depend on your toast library
    console.log('New notification:', notification);
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);