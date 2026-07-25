import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetUnreadCountQuery } from '@/store/api/notificationsApi';
import { useNotificationsSocket } from '@/hooks/useNotificationsSocket';

interface NotificationBadgeProps {
  onClick: () => void;
}

export default function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const { unreadCount: socketUnreadCount } = useNotificationsSocket();
  const { data: apiUnreadCount } = useGetUnreadCountQuery();
  const [displayCount, setDisplayCount] = useState(0);

  // Use socket count if available, otherwise use API count
  useEffect(() => {
    setDisplayCount(socketUnreadCount || apiUnreadCount || 0);
  }, [socketUnreadCount, apiUnreadCount]);

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {displayCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
          {displayCount > 99 ? '99+' : displayCount}
        </span>
      )}
    </button>
  );
}
