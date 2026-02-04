import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { createAuthRouter } from '../auth/auth.router';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/password.service';
import { EmailService } from '../auth/email.service';
import { SessionService } from '../auth/session.service';
import { MessageService } from '../message/message.service';
import { SocketService } from '../socket/socket.service';
import { SocketGateway } from '../socket/socket.gateway';
import { createMessageRouter } from '../message/message.router';
import { JwtService } from '@nestjs/jwt';

// Initialize services
const prismaService = new PrismaService();
const passwordService = new PasswordService();
const emailService = new EmailService();
const sessionService = new SessionService();
const jwtService = new JwtService({
  secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
});
const socketGateway = new SocketGateway(jwtService, prismaService);
const socketService = new SocketService(socketGateway);
const authService = new AuthService(prismaService, passwordService, jwtService, emailService, sessionService);
const messageService = new MessageService(prismaService, socketService);

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

  auth: createAuthRouter(authService, sessionService),
  message: createMessageRouter(messageService),
});

export type AppRouter = typeof appRouter;
