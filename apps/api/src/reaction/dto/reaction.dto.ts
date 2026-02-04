import { z } from 'zod';

/**
 * Add reaction to message
 */
export const addReactionSchema = z.object({
  messageId: z.string().cuid(),
  emoji: z
    .string()
    .min(1, 'Emoji required')
    .max(10, 'Emoji too long')
    .regex(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u, 'Invalid emoji'),
});

export type AddReactionDto = z.infer<typeof addReactionSchema>;

/**
 * Remove reaction from message
 */
export const removeReactionSchema = z.object({
  messageId: z.string().cuid(),
  emoji: z.string().min(1, 'Emoji required'),
});

export type RemoveReactionDto = z.infer<typeof removeReactionSchema>;

/**
 * Get reactions for message
 */
export const getReactionsSchema = z.object({
  messageId: z.string().cuid(),
});

export type GetReactionsDto = z.infer<typeof getReactionsSchema>;
