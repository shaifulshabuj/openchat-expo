import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

export interface QueuedMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: string;
  mediaUrl: string | null;
  createdAt: string;
  attempts: number;
}

@Injectable()
export class OfflineQueueService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private getQueueKey(userId: string): string {
    return `offline_queue:${userId}`;
  }

  /**
   * Queue a message for a single user
   */
  async queueMessage(userId: string, message: QueuedMessage): Promise<void> {
    const key = this.getQueueKey(userId);
    const serialized = JSON.stringify(message);

    // Add to queue (FIFO - right push)
    await this.redis.rpush(key, serialized);

    // Set expiration to 7 days (604800 seconds)
    await this.redis.expire(key, 604800);
  }

  /**
   * Queue message for multiple offline users (batch operation)
   */
  async queueForOfflineUsers(
    userIds: string[],
    message: QueuedMessage,
  ): Promise<void> {
    if (userIds.length === 0) return;

    const pipeline = this.redis.pipeline();
    const serialized = JSON.stringify(message);

    for (const userId of userIds) {
      const key = this.getQueueKey(userId);
      pipeline.rpush(key, serialized);
      pipeline.expire(key, 604800); // 7 days
    }

    await pipeline.exec();
  }

  /**
   * Get all queued messages for a user
   */
  async getQueuedMessages(userId: string): Promise<QueuedMessage[]> {
    const key = this.getQueueKey(userId);
    const messages = await this.redis.lrange(key, 0, -1);

    return messages.map((msg) => JSON.parse(msg) as QueuedMessage);
  }

  /**
   * Get queued messages with pagination
   */
  async getQueuedMessagesPaginated(
    userId: string,
    limit: number = 50,
  ): Promise<{
    messages: QueuedMessage[];
    total: number;
    hasMore: boolean;
  }> {
    const key = this.getQueueKey(userId);

    // Get total count
    const total = await this.redis.llen(key);

    // Get limited messages (FIFO - oldest first)
    const messages = await this.redis.lrange(key, 0, limit - 1);

    const parsed = messages.map((msg) => JSON.parse(msg) as QueuedMessage);

    return {
      messages: parsed,
      total,
      hasMore: total > limit,
    };
  }

  /**
   * Clear delivered messages from queue
   */
  async clearDeliveredMessages(
    userId: string,
    messageIds: string[],
  ): Promise<void> {
    if (messageIds.length === 0) return;

    const key = this.getQueueKey(userId);
    const messages = await this.redis.lrange(key, 0, -1);

    // Filter out delivered messages
    const remaining = messages.filter((msg) => {
      const parsed = JSON.parse(msg) as QueuedMessage;
      return !messageIds.includes(parsed.id);
    });

    // Delete old queue
    await this.redis.del(key);

    // Re-create queue with remaining messages
    if (remaining.length > 0) {
      const pipeline = this.redis.pipeline();
      for (const msg of remaining) {
        pipeline.rpush(key, msg);
      }
      pipeline.expire(key, 604800); // 7 days
      await pipeline.exec();
    }
  }

  /**
   * Clear all queued messages for a user
   */
  async clearQueue(userId: string): Promise<void> {
    const key = this.getQueueKey(userId);
    await this.redis.del(key);
  }

  /**
   * Get queue status (pending count + oldest message)
   */
  async getQueueStatus(userId: string): Promise<{
    pending: number;
    oldestMessage: QueuedMessage | null;
  }> {
    const key = this.getQueueKey(userId);

    // Get pending count
    const pending = await this.redis.llen(key);

    // Get oldest message (first in queue)
    let oldestMessage: QueuedMessage | null = null;
    if (pending > 0) {
      const oldest = await this.redis.lindex(key, 0);
      if (oldest) {
        oldestMessage = JSON.parse(oldest) as QueuedMessage;
      }
    }

    return { pending, oldestMessage };
  }

  /**
   * Increment retry attempt count for a message
   */
  async incrementAttempt(userId: string, messageId: string): Promise<void> {
    const key = this.getQueueKey(userId);
    const messages = await this.redis.lrange(key, 0, -1);

    // Find and update the message
    const updated = messages.map((msg) => {
      const parsed = JSON.parse(msg) as QueuedMessage;
      if (parsed.id === messageId) {
        parsed.attempts += 1;
        return JSON.stringify(parsed);
      }
      return msg;
    });

    // Replace queue with updated messages
    await this.redis.del(key);
    if (updated.length > 0) {
      const pipeline = this.redis.pipeline();
      for (const msg of updated) {
        pipeline.rpush(key, msg);
      }
      pipeline.expire(key, 604800); // 7 days
      await pipeline.exec();
    }
  }
}
