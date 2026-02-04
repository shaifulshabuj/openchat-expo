import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../api/src/trpc/router';
import { storage } from '../src/lib/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Helper to get auth token
const getToken = async () => {
  return await storage.getAccessToken();
};

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,
      headers: async () => {
        const token = await getToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
