import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway as WSGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@WSGateway({
  cors: {
    origin: ['http://localhost:4200', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<number, string[]>(); // userId -> socketIds

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        client.disconnect();
        return;
      }

      client.data.userId = user.id;
      client.data.organizationId = user.organization_id;

      // Add socket to user's socket list
      const socketIds = this.userSocketMap.get(user.id) || [];
      socketIds.push(client.id);
      this.userSocketMap.set(user.id, socketIds);

      // Join user's personal room
      await client.join(`user:${user.id}`);

      // Send unread count
      const unreadCount = await this.getUnreadCount(user.id);
      client.emit('unread_count', unreadCount);

      console.log(`User ${user.email} connected to notifications`);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      // Remove socket from user's socket list
      const socketIds = this.userSocketMap.get(userId) || [];
      const index = socketIds.indexOf(client.id);
      if (index > -1) {
        socketIds.splice(index, 1);
      }

      if (socketIds.length === 0) {
        this.userSocketMap.delete(userId);
      } else {
        this.userSocketMap.set(userId, socketIds);
      }

      console.log(`User ${userId} disconnected from notifications`);
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() data: { notificationId: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.data.userId;

    if (!userId) {
      return;
    }

    // Broadcast to all user's sockets
    this.server.to(`user:${userId}`).emit('notification_marked_read', {
      notificationId: data.notificationId,
    });
  }

  @SubscribeMessage('mark_all_read')
  async handleMarkAllRead(@ConnectedSocket() client: Socket): Promise<void> {
    const userId = client.data.userId;

    if (!userId) {
      return;
    }

    // Broadcast to all user's sockets
    this.server.to(`user:${userId}`).emit('all_notifications_marked_read');
  }

  sendNotificationToUser(userId: number, notification: any): void {
    this.server.to(`user:${userId}`).emit('new_notification', notification);
  }

  sendUnreadCount(userId: number, count: number): void {
    this.server.to(`user:${userId}`).emit('unread_count', count);
  }

  private async getUnreadCount(userId: number): Promise<number> {
    // This will be called from the service
    return 0;
  }
}
