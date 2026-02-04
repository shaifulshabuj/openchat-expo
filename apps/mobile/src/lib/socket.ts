import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface SocketConfig {
  token: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Create Socket.io client instance
 */
export const createSocket = (config: SocketConfig): Socket => {
  const socket = io(SOCKET_URL, {
    auth: {
      token: config.token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket.id);
    config.onConnect?.();
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
    config.onDisconnect?.();
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
    config.onError?.(error);
  });

  return socket;
};
