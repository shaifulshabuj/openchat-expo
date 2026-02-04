import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus } from '@prisma/client';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: '*', // For development; restrict in production
    credentials: true,
  },
  namespace: '/',
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SocketGateway');
  private onlineUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Socket.io server initialized');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake auth or query
      const token =
        client.handshake.auth.token || client.handshake.query.token;

      if (!token) {
        this.logger.warn(`Client ${client.id} connection rejected: No token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token as string);
      const userId = payload.sub;

      if (!userId) {
        this.logger.warn(
          `Client ${client.id} connection rejected: Invalid token`,
        );
        client.disconnect();
        return;
      }

      // Attach user data to socket
      client.userId = userId;
      client.user = payload;

      // Track online user
      this.onlineUsers.set(userId, client.id);

      // Update user status in database
      await this.prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.ONLINE, lastSeen: new Date() },
      });

      // Join user's personal room for targeted messages
      client.join(`user:${userId}`);

      // Auto-join user's conversation rooms
      const conversations = await this.prisma.conversationMember.findMany({
        where: { userId },
        select: { conversationId: true },
      });

      for (const { conversationId } of conversations) {
        client.join(`conversation:${conversationId}`);
      }

      this.logger.log(
        `User ${userId} connected and joined ${conversations.length} conversation rooms (socket: ${client.id})`,
      );

      // Notify user's contacts that they're online
      this.server.emit('user:online', { userId, timestamp: new Date() });

      // Send confirmation to client
      client.emit('connected', {
        message: 'Successfully connected to OpenChat',
        userId,
      });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.userId;

    if (userId) {
      // Remove from online users
      this.onlineUsers.delete(userId);

      // Update user status in database
      await this.prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.OFFLINE, lastSeen: new Date() },
      });

      this.logger.log(`User ${userId} disconnected (socket: ${client.id})`);

      // Notify user's contacts that they're offline
      this.server.emit('user:offline', { userId, timestamp: new Date() });
    }
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    // Broadcast to conversation participants (excluding sender)
    client.to(`conversation:${data.conversationId}`).emit('user:typing', {
      userId,
      conversationId: data.conversationId,
      isTyping: true,
    });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    // Broadcast to conversation participants (excluding sender)
    client.to(`conversation:${data.conversationId}`).emit('user:typing', {
      userId,
      conversationId: data.conversationId,
      isTyping: false,
    });
  }

  @SubscribeMessage('conversation:join')
  async handleConversationJoin(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    client.join(`conversation:${data.conversationId}`);
    this.logger.log(
      `User ${userId} joined conversation ${data.conversationId}`,
    );
  }

  @SubscribeMessage('conversation:leave')
  async handleConversationLeave(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.userId;
    if (!userId) return;

    client.leave(`conversation:${data.conversationId}`);
    this.logger.log(
      `User ${userId} left conversation ${data.conversationId}`,
    );
  }

  /**
   * Emit message to specific user
   */
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit message to conversation participants
   */
  emitToConversation(conversationId: string, event: string, data: any) {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount(): number {
    return this.onlineUsers.size;
  }

  /**
   * Get all online user IDs
   */
  getOnlineUserIds(): string[] {
    return Array.from(this.onlineUsers.keys());
  }
}
