import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { createAuthRouter } from '../auth/auth.router';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/password.service';

// Initialize services
const prismaService = new PrismaService();
const passwordService = new PasswordService();
const authService = new AuthService(prismaService, passwordService);

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

  auth: createAuthRouter(authService),
});

export type AppRouter = typeof appRouter;
