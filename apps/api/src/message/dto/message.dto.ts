import { z } from 'zod';
import { MessageType } from '@prisma/client';

export const sendMessageSchema = z.object({
  conversationId: z.string().cuid(),
  content: z.string().min(1).max(10000).optional(),
  type: z.nativeEnum(MessageType).default(MessageType.TEXT),
  mediaUrl: z.string().url().optional(),
  mediaType: z.string().optional(),
  mediaSize: z.number().int().positive().optional(),
  mediaThumbnailUrl: z.string().url().optional(),
  mediaDuration: z.number().int().positive().optional(),
  replyToId: z.string().cuid().optional(),
  mentions: z.array(z.string().cuid()).optional(),
});

export const getHistorySchema = z.object({
  conversationId: z.string().cuid(),
  limit: z.number().int().min(1).max(100).default(50),
  cursor: z.string().datetime().optional(),
});

export const markAsReadSchema = z.object({
  messageId: z.string().cuid(),
});

export const editMessageSchema = z.object({
  messageId: z.string().cuid(),
  content: z.string().min(1).max(10000),
});

export const deleteMessageSchema = z.object({
  messageId: z.string().cuid(),
});

export const searchMessagesSchema = z.object({
  conversationId: z.string().cuid(),
  query: z.string().min(1).max(100),
  limit: z.number().int().min(1).max(50).default(20),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetHistoryInput = z.infer<typeof getHistorySchema>;
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
export type EditMessageInput = z.infer<typeof editMessageSchema>;
export type DeleteMessageInput = z.infer<typeof deleteMessageSchema>;
export type SearchMessagesInput = z.infer<typeof searchMessagesSchema>;
