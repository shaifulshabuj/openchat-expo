import { initTRPC } from '@trpc/server';
import { MessageService } from './message.service';
import {
  sendMessageSchema,
  getHistorySchema,
  markAsReadSchema,
  editMessageSchema,
  deleteMessageSchema,
  searchMessagesSchema,
} from './dto/message.dto';
import { z } from 'zod';

const t = initTRPC.create();

export const createMessageRouter = (messageService: MessageService) => {
  return t.router({
    /**
     * Send a message
     */
    send: t.procedure
      .input(sendMessageSchema.extend({ senderId: z.string() }))
      .mutation(async ({ input }) => {
        return messageService.sendMessage(input);
      }),

    /**
     * Get message history (paginated)
     */
    getHistory: t.procedure
      .input(getHistorySchema.extend({ userId: z.string() }))
      .query(async ({ input }) => {
        return messageService.getHistory(input);
      }),

    /**
     * Mark message as read
     */
    markAsRead: t.procedure
      .input(markAsReadSchema.extend({ userId: z.string() }))
      .mutation(async ({ input }) => {
        return messageService.markAsRead(input);
      }),

    /**
     * Edit message
     */
    edit: t.procedure
      .input(editMessageSchema.extend({ userId: z.string() }))
      .mutation(async ({ input }) => {
        return messageService.editMessage(input);
      }),

    /**
     * Delete message (soft delete)
     */
    delete: t.procedure
      .input(deleteMessageSchema.extend({ userId: z.string() }))
      .mutation(async ({ input }) => {
        return messageService.deleteMessage(input);
      }),

    /**
     * Search messages in conversation
     */
    search: t.procedure
      .input(searchMessagesSchema.extend({ userId: z.string() }))
      .query(async ({ input }) => {
        return messageService.searchMessages(input);
      }),
  });
};
