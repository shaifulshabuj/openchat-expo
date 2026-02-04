import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../api/src/trpc/router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,
    }),
  ],
});
