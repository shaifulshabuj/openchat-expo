import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { createAuthRouter } from '../auth/auth.router';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/password.service';
import { EmailService } from '../auth/email.service';
import { SessionService } from '../auth/session.service';
import { MessageService } from '../message/message.service';
import { ReactionService } from '../reaction/reaction.service';
import { SocketService } from '../socket/socket.service';
import { SocketGateway } from '../socket/socket.gateway';
import { createMessageRouter } from '../message/message.router';
import { createReactionRouter } from '../reaction/reaction.router';
import { createOfflineQueueRouter } from '../offline-queue/offline-queue.router';
import { OfflineQueueService } from '../offline-queue/offline-queue.service';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
});

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
const offlineQueueService = new OfflineQueueService(redis);
const authService = new AuthService(prismaService, passwordService, jwtService, emailService, sessionService);
const messageService = new MessageService(prismaService, socketService, offlineQueueService);
const reactionService = new ReactionService(prismaService, socketService);

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
  reaction: createReactionRouter(reactionService),
  offlineQueue: createOfflineQueueRouter(offlineQueueService),
});

export type AppRouter = typeof appRouter;
