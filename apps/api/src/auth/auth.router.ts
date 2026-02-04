import { initTRPC, TRPCError } from '@trpc/server';
import { AuthService } from './auth.service';
import { registerSchema } from './dto/register.dto';

const t = initTRPC.create();

export const createAuthRouter = (authService: AuthService) => {
  return t.router({
    register: t.procedure
      .input(registerSchema)
      .mutation(async ({ input }) => {
        return authService.register(input);
      }),
  });
};

export type AuthRouter = ReturnType<typeof createAuthRouter>;
