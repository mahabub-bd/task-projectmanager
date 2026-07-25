import { io, Socket } from 'socket.io-client';
import { store } from '@/store/store';
import { notificationsApi } from '@/store/api/notificationsApi';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token: string) {
    // Don't reconnect if already connected or connecting
    if (this.socket) {
      return;
    }

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    this.socket = io(`${API_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    // Listen for new notifications
    this.socket.on('new_notification', (notification) => {
      console.log('New notification received:', notification);

      // Invalidate notifications query to refetch
      store.dispatch(
        notificationsApi.util.invalidateTags(['Notification'])
      );

      // Dispatch custom event for toast notification
      window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
    });

    // Listen for unread count updates
    this.socket.on('unread_count', (count) => {
      console.log('Unread count updated:', count);
      store.dispatch(
        notificationsApi.util.invalidateTags(['Notification'])
      );
    });

    // Listen for notification marked as read
    this.socket.on('notification_marked_read', (data) => {
      console.log('Notification marked as read:', data);
      store.dispatch(
        notificationsApi.util.invalidateTags(['Notification'])
      );
    });

    // Listen for all notifications marked as read
    this.socket.on('all_notifications_marked_read', () => {
      console.log('All notifications marked as read');
      store.dispatch(
        notificationsApi.util.invalidateTags(['Notification'])
      );
    });
  }

  disconnect() {
    if (this.socket) {
      if (this.socket.connected) {
        this.socket.disconnect();
      }
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const websocketService = new WebSocketService();
