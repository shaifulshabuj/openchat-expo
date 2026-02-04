import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
import { AddReactionDto, RemoveReactionDto } from './dto/reaction.dto';

export interface ReactionGroup {
  emoji: string;
  count: number;
  userIds: string[];
  hasReacted: boolean; // Current user has reacted
}

@Injectable()
export class ReactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}

  /**
   * Add emoji reaction to message
   */
  async addReaction(userId: string, dto: AddReactionDto) {
    const { messageId, emoji } = dto;

    // 1. Verify message exists and user is conversation member
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            members: { where: { userId }, select: { userId: true } },
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.conversation.members.length === 0) {
      throw new ForbiddenException('Not a member of this conversation');
    }

    // 2. Check if reaction already exists (prevent duplicates)
    const existingReaction = await this.prisma.reaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });

    if (existingReaction) {
      // Already reacted with this emoji, return existing
      return existingReaction;
    }

    // 3. Create reaction
    const reaction = await this.prisma.reaction.create({
      data: {
        messageId,
        userId,
        emoji,
      },
    });

    // 4. Emit real-time event to conversation
    this.socketService.notifyReaction(message.conversationId, {
      type: 'added',
      messageId,
      emoji: reaction.emoji,
      userId: reaction.userId,
      reactionId: reaction.id,
      createdAt: reaction.createdAt,
    });

    return reaction;
  }

  /**
   * Remove emoji reaction from message
   */
  async removeReaction(userId: string, dto: RemoveReactionDto) {
    const { messageId, emoji } = dto;

    // 1. Find reaction
    const reaction = await this.prisma.reaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
      include: {
        message: {
          select: { conversationId: true },
        },
      },
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    // 2. Delete reaction
    await this.prisma.reaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });

    // 3. Emit real-time event to conversation
    this.socketService.notifyReaction(reaction.message.conversationId, {
      type: 'removed',
      messageId,
      emoji,
      userId,
    });

    return { success: true };
  }

  /**
   * Get all reactions for a message (grouped by emoji)
   */
  async getReactions(userId: string, messageId: string): Promise<ReactionGroup[]> {
    // 1. Verify user is conversation member
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            members: { where: { userId }, select: { userId: true } },
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.conversation.members.length === 0) {
      throw new ForbiddenException('Not a member of this conversation');
    }

    // 2. Fetch all reactions
    const reactions = await this.prisma.reaction.findMany({
      where: { messageId },
      orderBy: { createdAt: 'asc' },
    });

    // 3. Group by emoji
    const grouped = new Map<string, ReactionGroup>();

    for (const reaction of reactions) {
      const existing = grouped.get(reaction.emoji);

      if (existing) {
        existing.count++;
        existing.userIds.push(reaction.userId);
        if (reaction.userId === userId) {
          existing.hasReacted = true;
        }
      } else {
        grouped.set(reaction.emoji, {
          emoji: reaction.emoji,
          count: 1,
          userIds: [reaction.userId],
          hasReacted: reaction.userId === userId,
        });
      }
    }

    return Array.from(grouped.values());
  }
}
