import { useCallback, useEffect, useMemo, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import useApi from './useApi';

export default function useAuth() {
  const { request } = useApi();
  const [token, setToken] = useLocalStorage('token', null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const isAuthenticated = useMemo(() => Boolean(token && user), [token, user]);

  const fetchMe = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const data = await request('/api/auth/me', { token });
      setUser(data.user);
      return data.user;
    } catch (_) {
      // invalid token
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [request, token, setToken]);

  useEffect(() => {
    if (token) fetchMe();
  }, [token, fetchMe]);

  const login = useCallback((newToken, userData) => {
    setToken(newToken);
    setUser(userData || null);
  }, [setToken]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  return { token, user, setUser, login, logout, fetchMe, loading, isAuthenticated };
}


