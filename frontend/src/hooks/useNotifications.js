import { useCallback, useEffect, useMemo, useState } from 'react';
import useApi from './useApi';
import useAuth from './useAuth';

export default function useNotifications({ pageSize = 20 } = {}) {
  const { request } = useApi();
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (nextPage = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await request(`/api/notifications?limit=${pageSize}&page=${nextPage}`, { token });
      setUnreadCount(data.unreadCount || 0);
      setHasMore(Boolean(data.hasMore));
      setItems((prev) => nextPage === 1 ? data.notifications : [...prev, ...data.notifications]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }, [request, token, pageSize]);

  const reload = useCallback(() => load(1), [load]);
  const loadMore = useCallback(() => hasMore && load(page + 1), [hasMore, load, page]);

  const markAsRead = useCallback(async (id) => {
    if (!token) return;
    await request(`/api/notifications/${id}/read`, { method: 'PATCH', token });
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, [request, token]);

  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    await request('/api/notifications/mark-all-read', { method: 'PATCH', token });
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
    setUnreadCount(0);
  }, [request, token]);

  useEffect(() => { load(1); }, [token, load]);

  return { items, unreadCount, loading, hasMore, loadMore, reload, markAsRead, markAllAsRead };
}


