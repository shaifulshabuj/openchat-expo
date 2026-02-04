import { initTRPC, TRPCError } from '@trpc/server';
import { AuthService } from './auth.service';
import { registerSchema } from './dto/register.dto';
import { loginSchema } from './dto/login.dto';

const t = initTRPC.create();

export const createAuthRouter = (authService: AuthService) => {
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
      .input(loginSchema)
      .mutation(async ({ ctx }) => {
        // In a real app, we'd extract userId from the auth context
        // For now, we'll require userId in the input for testing
        const userId = (ctx as any).userId;
        if (!userId) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Not authenticated',
          });
        }
        return authService.logout(userId);
      }),
  });
};

export type AuthRouter = ReturnType<typeof createAuthRouter>;
