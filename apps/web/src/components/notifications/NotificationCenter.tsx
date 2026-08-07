import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNotificationsSocket } from '@/hooks/useNotificationsSocket';
import { useDeleteNotificationMutation, useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from '@/store/api';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckSquare, Clock, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function NotificationCenter() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery();
  const { unreadCount: socketUnreadCount, latestNotification } = useNotificationsSocket();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.items || [];
  // Use socket count if available, otherwise calculate from notifications
  const unreadCount = socketUnreadCount || notifications.filter((n) => !n.read_at).length;

  // Refetch notifications when real-time notification arrives
  useEffect(() => {
    if (latestNotification) {
      refetch();
    }
  }, [latestNotification, refetch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteNotification(id);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }

    if (notification.action_url) {
      navigate(notification.action_url);
      setIsOpen(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <div className="h-2 w-2 rounded-full bg-destructive" />;
      case 'medium':
        return <div className="h-2 w-2 rounded-full bg-primary" />;
      case 'low':
      default:
        return <div className="h-2 w-2 rounded-full bg-muted-foreground" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 flex max-h-[80vh] w-96 flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
          {/* Header */}
          <div className="border-b border-border bg-muted/60 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <Bell className="h-12 w-12 mb-2" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      cursor-pointer p-4 transition-colors hover:bg-accent/70
                      ${!notification.read_at ? 'bg-primary/10' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Priority Indicator */}
                      <div className="mt-1">{getPriorityIcon(notification.priority)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read_at
                                  ? 'text-foreground'
                                  : 'text-foreground/80'
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {!notification.read_at && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="rounded p-1.5 transition-colors hover:bg-accent"
                            title="Mark as read"
                          >
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(notification.id, e)}
                          className="rounded p-1.5 transition-colors hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border bg-muted/60 p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-sm"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
