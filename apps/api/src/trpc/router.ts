import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { createAuthRouter } from '../auth/auth.router';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/password.service';
import { EmailService } from '../auth/email.service';
import { JwtService } from '@nestjs/jwt';

// Initialize services
const prismaService = new PrismaService();
const passwordService = new PasswordService();
const emailService = new EmailService();
const jwtService = new JwtService({
  secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
});
const authService = new AuthService(prismaService, passwordService, jwtService, emailService);

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
