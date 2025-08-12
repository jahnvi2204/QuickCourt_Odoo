import { useEffect, useMemo, useRef, useState } from 'react';
import io from 'socket.io-client';
import useAuth from './useAuth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function useSocket() {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return undefined;
    const socket = io(API_BASE_URL, { auth: { token } });
    socketRef.current = socket;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onNotification = (payload) => setMessages((prev) => [payload, ...prev]);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('notification', onNotification);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification', onNotification);
      socket.disconnect();
    };
  }, [token]);

  return useMemo(() => ({ socket: socketRef.current, isConnected, messages, setMessages }), [isConnected, messages]);
}


