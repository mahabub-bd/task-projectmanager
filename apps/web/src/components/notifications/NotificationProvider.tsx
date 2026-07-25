import { websocketService } from '@/services/websocket.service';
import { Notification } from '@/store/api/notificationsApi';
import { RootState } from '@/store/store';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NotificationToast } from './NotificationToast';

interface ActiveToast {
  id: string;
  notification: Notification;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { access_token } = useSelector((state: RootState) => state.auth);
  const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    if (access_token && !websocketService.isConnected()) {
      websocketService.connect(access_token);
    }

    return () => {
      if (websocketService.isConnected()) {
        websocketService.disconnect();
      }
    };
  }, [access_token]);

  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      const notification = event.detail;

      // Add toast to active toasts
      const toastId = `${notification.id}-${Date.now()}`;
      setActiveToasts((prev) => [...prev, { id: toastId, notification }]);

      // Remove toast after animation
      setTimeout(() => {
        setActiveToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 9000); // 8s display + 1s animation
    };

    // Listen for custom event from WebSocket service
    window.addEventListener('new-notification', handleNewNotification as EventListener);

    return () => {
      window.removeEventListener('new-notification', handleNewNotification as EventListener);
    };
  }, []);

  const handleToastClose = useCallback((toastId: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  return (
    <>
      {children}
      {activeToasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          notification={toast.notification}
          onClose={() => handleToastClose(toast.id)}
        />
      ))}
    </>
  );
}
