import { initTRPC } from '@trpc/server';
import { ReactionService } from './reaction.service';
import {
  addReactionSchema,
  removeReactionSchema,
  getReactionsSchema,
} from './dto/reaction.dto';
import { z } from 'zod';

const t = initTRPC.create();

export const createReactionRouter = (reactionService: ReactionService) => {
  return t.router({
    /**
     * Add reaction to message
     */
    addReaction: t.procedure
      .input(addReactionSchema.extend({ userId: z.string() }))
      .mutation(async ({ input }) => {
        const { userId, ...dto } = input;
        return reactionService.addReaction(userId, dto);
      }),

    /**
     * Remove reaction from message
     */
    removeReaction: t.procedure
      .input(removeReactionSchema.extend({ userId: z.string() }))
      .mutation(async ({ input }) => {
        const { userId, ...dto } = input;
        return reactionService.removeReaction(userId, dto);
      }),

    /**
     * Get all reactions for message (grouped by emoji)
     */
    getReactions: t.procedure
      .input(getReactionsSchema.extend({ userId: z.string() }))
      .query(async ({ input }) => {
        return reactionService.getReactions(input.userId, input.messageId);
      }),
  });
};
