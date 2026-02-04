import { initTRPC } from '@trpc/server';
import { OfflineQueueService } from './offline-queue.service';
import {
  queueMessageSchema,
  getQueuedMessagesSchema,
  clearDeliveredMessagesSchema,
} from './dto/offline-queue.dto';
import { z } from 'zod';

const t = initTRPC.create();

export const createOfflineQueueRouter = (
  offlineQueueService: OfflineQueueService,
) => {
  return t.router({
    /**
     * Queue a message for a user (internal use)
     */
    queueMessage: t.procedure.input(queueMessageSchema).mutation(async ({ input }) => {
      await offlineQueueService.queueMessage(input.userId, input.message);
      return { success: true };
    }),

    /**
     * Get queued messages for current user
     */
    getQueuedMessages: t.procedure
      .input(
        getQueuedMessagesSchema.extend({
          userId: z.string().cuid(),
        }),
      )
      .query(async ({ input }) => {
        return offlineQueueService.getQueuedMessagesPaginated(
          input.userId,
          input.limit,
        );
      }),

    /**
     * Clear delivered messages from queue
     */
    clearDeliveredMessages: t.procedure
      .input(
        clearDeliveredMessagesSchema.extend({
          userId: z.string().cuid(),
        }),
      )
      .mutation(async ({ input }) => {
        await offlineQueueService.clearDeliveredMessages(
          input.userId,
          input.messageIds,
        );
        return { success: true };
      }),

    /**
     * Clear all queued messages for current user
     */
    clearQueue: t.procedure
      .input(z.object({ userId: z.string().cuid() }))
      .mutation(async ({ input }) => {
        await offlineQueueService.clearQueue(input.userId);
        return { success: true };
      }),

    /**
     * Get queue status (pending count + oldest message)
     */
    getQueueStatus: t.procedure
      .input(z.object({ userId: z.string().cuid() }))
      .query(async ({ input }) => {
        return offlineQueueService.getQueueStatus(input.userId);
      }),
  });
};
