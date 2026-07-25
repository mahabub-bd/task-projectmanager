import { Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, set to your frontend domain
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, Socket[]>(); // userId -> sockets

  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify token and get user
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store the connection
      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, []);
      }
      this.connectedUsers.get(userId)!.push(client);

      // Join user's personal room
      client.join(`user:${userId}`);

      // Send unread count
      const unreadCount = await this.notificationsService.getUnreadCount(userId);
      client.emit('unread-count', unreadCount);

      console.log(`User ${userId} connected. Total connected: ${this.getConnectedUserCount()}`);
    } catch (error) {
      console.error('Connection error:', error instanceof Error ? error.message : String(error));
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove socket from connected users
    for (const [userId, sockets] of this.connectedUsers.entries()) {
      const index = sockets.findIndex(s => s.id === client.id);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.connectedUsers.delete(userId);
        }
        console.log(`User ${userId} disconnected. Total connected: ${this.getConnectedUserCount()}`);
        break;
      }
    }
  }

  // Send notification to specific user
  sendNotificationToUser(userId: number, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  // Send unread count to specific user
  sendUnreadCount(userId: number, count: number) {
    this.server.to(`user:${userId}`).emit('unread-count', count);
  }

  // Broadcast to organization
  sendToOrganization(organizationId: number, event: string, data: any) {
    this.server.to(`org:${organizationId}`).emit(event, data);
  }

  // Join organization room
  @SubscribeMessage('join-organization')
  handleJoinOrganization(
    @MessageBody() data: { organizationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `org:${data.organizationId}`;
    client.join(room);
    client.emit('joined-organization', { organizationId: data.organizationId });
  }

  // Leave organization room
  @SubscribeMessage('leave-organization')
  handleLeaveOrganization(
    @MessageBody() data: { organizationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `org:${data.organizationId}`;
    client.leave(room);
    client.emit('left-organization', { organizationId: data.organizationId });
  }

  // Test connection
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  private getConnectedUserCount(): number {
    return this.connectedUsers.size;
  }

  // Check if user is online
  isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId) && this.connectedUsers.get(userId)!.length > 0;
  }

  // Get all connected user IDs
  getOnlineUsers(): number[] {
    return Array.from(this.connectedUsers.keys());
  }
}
