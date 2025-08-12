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