import { router, publicProcedure } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'OpenChat API is running',
      timestamp: new Date().toISOString(),
    };
  }),
  
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}!`,
      };
    }),
});

export type AppRouter = typeof appRouter;
