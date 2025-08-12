import React, { useEffect, useMemo, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button.jsx';
import NotificationItem from './NotificationItem.jsx';
import useNotifications from '../../hooks/useNotifications';

export default function NotificationCenter() {
  const { items, unreadCount, loading, hasMore, loadMore, reload, markAsRead, markAllAsRead } = useNotifications({ pageSize: 10 });
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'unread') return items.filter((n) => !n.isRead);
    return items;
  }, [filter, items]);

  useEffect(() => { reload(); }, []); // initial

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Notifications {unreadCount ? `(${unreadCount})` : ''}</div>
        <div className="flex gap-2">
          <select className="border rounded px-2 py-1 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
          <Button variant="outline" onClick={markAllAsRead}>Mark all read</Button>
          <Button variant="outline" onClick={reload}>Refresh</Button>
        </div>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
        {filtered.map((n) => (
          <NotificationItem key={n._id} notification={n} onRead={() => markAsRead(n._id)} />
        ))}
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
      </div>

      <div className="mt-3 flex justify-center">
        {hasMore && (
          <Button variant="outline" onClick={loadMore}>Load more</Button>
        )}
      </div>
    </Card>
  );
}


