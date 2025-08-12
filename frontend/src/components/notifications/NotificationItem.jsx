import React, { useMemo } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button.jsx';
import { Bell, CheckCircle2, Calendar, Star, CreditCard, AlertTriangle } from 'lucide-react';

const typeToIcon = {
  booking_confirmed: CheckCircle2,
  booking_cancelled: AlertTriangle,
  booking_reminder: Calendar,
  new_review: Star,
  payment_received: CreditCard,
  system_announcement: Bell,
};

function timeAgo(dateString) {
  try {
    const d = new Date(dateString);
    const diff = Math.max(0, Date.now() - d.getTime());
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  } catch {
    return '';
  }
}

export default function NotificationItem({ notification, onRead, onClick }) {
  const Icon = useMemo(() => typeToIcon[notification?.type] || Bell, [notification?.type]);
  const isRead = Boolean(notification?.isRead);

  return (
    <Card className={`flex items-start gap-3 ${isRead ? 'opacity-70' : ''}`}>
      <div className={`p-2 rounded-md ${isRead ? 'bg-gray-100 dark:bg-white/10' : 'bg-primary/10 text-primary'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium truncate">{notification?.title || 'Notification'}</div>
          <div className="text-xs text-gray-500 ml-2 whitespace-nowrap">{timeAgo(notification?.createdAt || notification?.updatedAt)}</div>
        </div>
        {notification?.message && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
            {notification.message}
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          {notification?.priority && <Badge className="uppercase">{notification.priority}</Badge>}
          {!isRead && (
            <Button variant="outline" className="text-xs px-2 py-1" onClick={() => onRead?.(notification)}>
              Mark as read
            </Button>
          )}
          {onClick && (
            <Button className="text-xs px-2 py-1" onClick={() => onClick(notification)}>
              View
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}


