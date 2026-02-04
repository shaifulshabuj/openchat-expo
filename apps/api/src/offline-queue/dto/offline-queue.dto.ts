import { z } from 'zod';

// Schema for queueing a message
export const queueMessageSchema = z.object({
  userId: z.string().cuid(),
  message: z.object({
    id: z.string().cuid(),
    conversationId: z.string().cuid(),
    senderId: z.string().cuid(),
    content: z.string().nullable(),
    type: z.string(),
    mediaUrl: z.string().url().nullable(),
    createdAt: z.string().datetime(),
    attempts: z.number().int().min(0).default(0),
  }),
});

// Schema for getting queued messages
export const getQueuedMessagesSchema = z.object({
  limit: z.number().int().min(1).max(100).default(50),
});

// Schema for clearing delivered messages
export const clearDeliveredMessagesSchema = z.object({
  messageIds: z.array(z.string().cuid()).min(1),
});

// TypeScript types
export type QueueMessageInput = z.infer<typeof queueMessageSchema>;
export type GetQueuedMessagesInput = z.infer<typeof getQueuedMessagesSchema>;
export type ClearDeliveredMessagesInput = z.infer<
  typeof clearDeliveredMessagesSchema
>;
