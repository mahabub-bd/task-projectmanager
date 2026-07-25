import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data: Record<string, any> | null;
  related_entity_type: string | null;
  related_entity_id: number | null;
  action_url: string | null;
  read_at: string | null;
  created_at: string;
}

interface UseNotificationsSocketReturn {
  isConnected: boolean;
  unreadCount: number;
  latestNotification: Notification | null;
  joinOrganization: (organizationId: number) => void;
  leaveOrganization: (organizationId: number) => void;
}

export function useNotificationsSocket(): UseNotificationsSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const accessToken = useSelector((state: RootState) => state.auth.access_token);

  useEffect(() => {
    if (!accessToken) return;

    // Get API base URL from env
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1';
    const wsUrl = apiBaseUrl.replace('/v1', '').replace('http://', 'ws://').replace('https://', 'wss://');

    // Create socket connection
    const socket = io(`${wsUrl}/notifications`, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to notifications WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notifications WebSocket');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Notification events
    socket.on('notification', (notification: Notification) => {
      console.log('New notification received:', notification);
      setLatestNotification(notification);

      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new window.Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id.toString(),
        });
      }
    });

    socket.on('unread-count', (count: number) => {
      setUnreadCount(count);
    });

    // Join organization event confirmation
    socket.on('joined-organization', ({ organizationId }: { organizationId: number }) => {
      console.log(`Joined organization: ${organizationId}`);
    });

    socket.on('left-organization', ({ organizationId }: { organizationId: number }) => {
      console.log(`Left organization: ${organizationId}`);
    });

    // Ping/Pong for connection health
    socket.on('pong', ({ timestamp }: { timestamp: string }) => {
      console.log('WebSocket pong:', timestamp);
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  const joinOrganization = (organizationId: number) => {
    socketRef.current?.emit('join-organization', { organizationId });
  };

  const leaveOrganization = (organizationId: number) => {
    socketRef.current?.emit('leave-organization', { organizationId });
  };

  return {
    isConnected,
    unreadCount,
    latestNotification,
    joinOrganization,
    leaveOrganization,
  };
}
