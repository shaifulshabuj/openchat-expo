import { initTRPC, TRPCError } from '@trpc/server';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { registerSchema } from './dto/register.dto';
import { loginSchema } from './dto/login.dto';
import { verifyEmailSchema, resendVerificationSchema } from './dto/verification.dto';
import { requestPasswordResetSchema, resetPasswordSchema } from './dto/password-reset.dto';
import { updateProfileSchema } from './dto/profile.dto';
import { z } from 'zod';

const t = initTRPC.create();

export const createAuthRouter = (authService: AuthService, sessionService: SessionService) => {
  return t.router({
    register: t.procedure
      .input(registerSchema)
      .mutation(async ({ input }) => {
        return authService.register(input);
      }),

    login: t.procedure
      .input(loginSchema)
      .mutation(async ({ input }) => {
        return authService.login(input);
      }),

    logout: t.procedure
      .input(z.object({ 
        userId: z.string(),
        sessionId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return authService.logout(input.userId, input.sessionId);
      }),

    verifyEmail: t.procedure
      .input(verifyEmailSchema)
      .mutation(async ({ input }) => {
        return authService.verifyEmail(input);
      }),

    resendVerification: t.procedure
      .input(resendVerificationSchema)
      .mutation(async ({ input }) => {
        return authService.resendVerification(input);
      }),

    requestPasswordReset: t.procedure
      .input(requestPasswordResetSchema)
      .mutation(async ({ input }) => {
        return authService.requestPasswordReset(input);
      }),

    resetPassword: t.procedure
      .input(resetPasswordSchema)
      .mutation(async ({ input }) => {
        return authService.resetPassword(input);
      }),

    // Session management procedures
    getActiveSessions: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        const sessions = await sessionService.getActiveSessions(input.userId);
        return {
          success: true,
          sessions,
          count: sessions.length,
        };
      }),

    revokeSession: t.procedure
      .input(z.object({ 
        userId: z.string(),
        sessionId: z.string(),
      }))
      .mutation(async ({ input }) => {
        const revoked = await sessionService.revokeSession(input.userId, input.sessionId);
        return {
          success: revoked,
          message: revoked ? 'Session revoked successfully' : 'Session not found',
        };
      }),

    revokeAllSessions: t.procedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ input }) => {
        const count = await sessionService.revokeAllSessions(input.userId);
        return {
          success: true,
          message: `${count} session(s) revoked`,
          count,
        };
      }),

    // Profile management procedures
    getProfile: t.procedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return authService.getProfile(input.userId);
      }),

    updateProfile: t.procedure
      .input(z.object({
        userId: z.string(),
        profile: updateProfileSchema,
      }))
      .mutation(async ({ input }) => {
        return authService.updateProfile(input.userId, input.profile);
      }),

    deleteAccount: t.procedure
      .input(z.object({
        userId: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        return authService.deleteAccount(input.userId, input.password);
      }),
  });
};

export type AuthRouter = ReturnType<typeof createAuthRouter>;
