import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '../lib/socket';
import { useAuth } from './AuthContext';
import { storage } from '../lib/storage';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    if (socket?.connected) {
      console.log('[Socket] Already connected');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('[Socket] Cannot connect: Not authenticated');
      return;
    }

    try {
      const token = await storage.getAccessToken();
      if (!token) {
        throw new Error('No token available');
      }

      console.log('[Socket] Connecting...');
      const newSocket = createSocket({
        token,
        onConnect: () => {
          setIsConnected(true);
          setError(null);
        },
        onDisconnect: () => {
          setIsConnected(false);
        },
        onError: (err) => {
          setError(err);
          setIsConnected(false);
        },
      });

      setSocket(newSocket);
    } catch (err) {
      console.error('[Socket] Connection failed:', err);
      setError(err instanceof Error ? err : new Error('Connection failed'));
    }
  }, [socket, isAuthenticated, user]);

  const disconnect = useCallback(() => {
    if (socket) {
      console.log('[Socket] Disconnecting...');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated && user && !socket) {
      connect();
    }

    // Cleanup on unmount or logout
    return () => {
      if (socket && !isAuthenticated) {
        disconnect();
      }
    };
  }, [isAuthenticated, user, socket, connect, disconnect]);

  const value: SocketContextValue = {
    socket,
    isConnected,
    error,
    connect,
    disconnect,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
