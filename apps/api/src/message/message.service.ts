import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.message.update({
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

    return this.prisma.message.update({
      where: { id: input.messageId },
      data: {
        deletedAt: new Date(),
        content: null, // Clear content for privacy
      },
    });
  }

  /**
   * Search messages in conversation
   */
  async searchMessages(input: {
    conversationId: string;
    userId: string;
    query: string;
    limit?: number;
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

    const limit = input.limit || 20;

    return this.prisma.message.findMany({
      where: {
        conversationId: input.conversationId,
        deletedAt: null,
        content: {
          contains: input.query,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
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
  }
}
