import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private socketGateway: SocketGateway) {}

  /**
   * Send message notification to specific user
   */
  notifyNewMessage(userId: string, message: any) {
    this.socketGateway.emitToUser(userId, 'message:new', message);
  }

  /**
   * Send message update to conversation participants
   */
  notifyMessageUpdate(conversationId: string, message: any) {
    this.socketGateway.emitToConversation(
      conversationId,
      'message:updated',
      message,
    );
  }

  /**
   * Send message deletion to conversation participants
   */
  notifyMessageDelete(conversationId: string, messageId: string) {
    this.socketGateway.emitToConversation(conversationId, 'message:deleted', {
      messageId,
    });
  }

  /**
   * Send message read receipt to sender
   */
  notifyMessageRead(userId: string, data: { messageId: string; readAt: Date }) {
    this.socketGateway.emitToUser(userId, 'message:read', data);
  }

  /**
   * Send message delivered receipt to sender
   */
  notifyMessageDelivered(
    userId: string,
    data: { messageId: string; deliveredAt: Date },
  ) {
    this.socketGateway.emitToUser(userId, 'message:delivered', data);
  }

  /**
   * Send reaction to conversation participants
   */
  notifyReaction(conversationId: string, reaction: any) {
    this.socketGateway.emitToConversation(
      conversationId,
      'message:reaction',
      reaction,
    );
  }

  /**
   * Check if user is currently online
   */
  isUserOnline(userId: string): boolean {
    return this.socketGateway.isUserOnline(userId);
  }

  /**
   * Get online users statistics
   */
  getOnlineStats() {
    return {
      count: this.socketGateway.getOnlineUsersCount(),
      users: this.socketGateway.getOnlineUserIds(),
    };
  }
}
