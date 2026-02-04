import { io, Socket } from 'socket.io-client';
import { storage } from './storage';

const SOCKET_URL = 'http://localhost:3000'; // Change to your backend URL

let socket: Socket | null = null;

export const initializeSocket = async (): Promise<Socket> => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = await storage.getAccessToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};
