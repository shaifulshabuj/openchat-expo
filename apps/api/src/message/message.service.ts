import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
import { OfflineQueueService } from '../offline-queue/offline-queue.service';
import { MessageType } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
    private readonly offlineQueueService: OfflineQueueService,
  ) {}

  /**
   * Send a new message
   */
  async sendMessage(input: {
    conversationId: string;
    senderId: string;
    content?: string;
    type?: MessageType;
    mediaUrl?: string;
    mediaType?: string;
    mediaSize?: number;
    mediaThumbnailUrl?: string;
    mediaDuration?: number;
    replyToId?: string;
    mentions?: string[];
  }) {
    // Verify user is participant of conversation
    const participant = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId: input.conversationId,
        userId: input.senderId,
      },
    });

    if (!participant) {
      throw new Error('User is not a participant of this conversation');
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: input.conversationId,
        senderId: input.senderId,
        content: input.content,
        type: input.type || MessageType.TEXT,
        mediaUrl: input.mediaUrl,
        mediaType: input.mediaType,
        mediaSize: input.mediaSize,
        mediaThumbnailUrl: input.mediaThumbnailUrl,
        mediaDuration: input.mediaDuration,
        replyToId: input.replyToId,
        mentions: input.mentions || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    // Update conversation lastMessageAt
    await this.prisma.conversation.update({
      where: { id: input.conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Emit real-time event to conversation room
    this.socketService.notifyMessageUpdate(input.conversationId, { message });

    // Send notifications to mentioned users
    if (input.mentions && input.mentions.length > 0) {
      for (const mentionedUserId of input.mentions) {
        this.socketService.notifyNewMessage(mentionedUserId, {
          message,
          conversationId: input.conversationId,
          type: 'mention',
        });
      }
    }

    // Queue message for offline users
    const members = await this.prisma.conversationMember.findMany({
      where: { conversationId: input.conversationId },
      select: { userId: true },
    });

    const offlineUserIds = members
      .map((m) => m.userId)
      .filter((uid) => uid !== input.senderId); // Exclude sender

    // Queue for all participants (Socket.io will handle online delivery)
    await this.offlineQueueService.queueForOfflineUsers(offlineUserIds, {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      mediaUrl: message.mediaUrl,
      createdAt: message.createdAt.toISOString(),
      attempts: 0,
    });

    return message;
  }

  /**
   * Get message history (paginated)
   */
  async getHistory(input: {
    conversationId: string;
    userId: string;
    limit?: number;
    cursor?: string;
  }) {
    // Verify user is participant
    const participant = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId: input.conversationId,
        userId: input.userId,
      },
    });

    if (!participant) {
      throw new Error('User is not a participant of this conversation');
    }

    const limit = input.limit || 50;

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId: input.conversationId,
        deletedAt: null, // Don't show deleted messages
        ...(input.cursor
          ? {
              createdAt: {
                lt: new Date(input.cursor),
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1, // Fetch one extra to determine if there's more
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
        reactions: true,
      },
    });

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, -1) : messages;

    return {
      items: items.reverse(), // Oldest first for display
      nextCursor: hasMore ? items[items.length - 1].createdAt.toISOString() : null,
    };
  }

  /**
   * Mark message as read
   */
  async markAsRead(input: {
    messageId: string;
    userId: string;
  }) {
    const message = await this.prisma.message.findUnique({
      where: { id: input.messageId },
      include: {
        conversation: {
          include: {
            members: {
              where: { userId: input.userId },
            },
          },
        },
      },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.conversation.members.length === 0) {
      throw new Error('User is not a participant of this conversation');
    }

    // Update message seen status
    const updated = await this.prisma.message.update({
      where: { id: input.messageId },
      data: {
        seenAt: message.seenAt || new Date(),
        deliveredAt: message.deliveredAt || new Date(),
      },
    });

    // Update user's lastReadAt in conversation
    await this.prisma.conversationMember.updateMany({
      where: {
        conversationId: message.conversationId,
        userId: input.userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    // Emit read receipt to conversation
    this.socketService.notifyMessageRead(message.senderId, {
      messageId: input.messageId,
      readAt: updated.seenAt!,
    });

    // Also emit to conversation for read receipt indicators
    this.socketService.notifyMessageUpdate(message.conversationId, {
      type: 'read',
      messageId: input.messageId,
      userId: input.userId,
      seenAt: updated.seenAt,
    });

    return updated;
  }

  /**
   * Edit message
   */
  async editMessage(input: {
    messageId: string;
    userId: string;
    content: string;
  }) {
    const message = await this.prisma.message.findUnique({
      where: { id: input.messageId },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== input.userId) {
      throw new Error('Only the sender can edit this message');
    }

    if (message.deletedAt) {
      throw new Error('Cannot edit a deleted message');
    }

    const updated = await this.prisma.message.update({
      where: { id: input.messageId },
      data: {
        content: input.content,
        editedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    // Emit update event to conversation
    this.socketService.notifyMessageUpdate(message.conversationId, {
      message: updated,
    });

    return updated;
  }

  /**
   * Delete message (soft delete)
   */
  async deleteMessage(input: {
    messageId: string;
    userId: string;
  }) {
    const message = await this.prisma.message.findUnique({
      where: { id: input.messageId },
    });

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== input.userId) {
      throw new Error('Only the sender can delete this message');
    }

    const updated = await this.prisma.message.update({
      where: { id: input.messageId },
      data: {
        deletedAt: new Date(),
        content: null, // Clear content for privacy
      },
    });

    // Emit delete event to conversation
    this.socketService.notifyMessageDelete(message.conversationId, input.messageId);

    return updated;
  }

  /**
   * Search messages with advanced filters
   */
  async searchMessages(input: {
    conversationId: string;
    userId: string;
    query?: string;
    messageType?: MessageType;
    senderId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    cursor?: string;
  }) {
    // 1. Verify user is conversation member
    const participant = await this.prisma.conversationMember.findFirst({
      where: {
        conversationId: input.conversationId,
        userId: input.userId,
      },
    });

    if (!participant) {
      throw new Error('User is not a participant of this conversation');
    }

    const limit = input.limit || 20;

    // 2. Build where clause dynamically
    const where: any = {
      conversationId: input.conversationId,
      deletedAt: null, // Exclude deleted messages
    };

    // Full-text search in content (optional)
    if (input.query) {
      where.content = {
        contains: input.query,
        mode: 'insensitive',
      };
    }

    // Filter by message type (optional)
    if (input.messageType) {
      where.type = input.messageType;
    }

    // Filter by sender (optional)
    if (input.senderId) {
      where.senderId = input.senderId;
    }

    // Filter by date range (optional)
    if (input.startDate || input.endDate) {
      where.createdAt = {};
      if (input.startDate) {
        where.createdAt.gte = new Date(input.startDate);
      }
      if (input.endDate) {
        where.createdAt.lte = new Date(input.endDate);
      }
    }

    // Cursor-based pagination (optional)
    if (input.cursor) {
      where.id = {
        lt: input.cursor,
      };
    }

    // 3. Fetch messages
    const messages = await this.prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        reactions: {
          select: {
            id: true,
            emoji: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1, // Fetch one extra to check for more results
    });

    // 4. Determine pagination
    const hasMore = messages.length > limit;
    const results = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? results[results.length - 1].id : null;

    return {
      messages: results,
      nextCursor,
      hasMore,
      total: results.length,
    };
  }
}
