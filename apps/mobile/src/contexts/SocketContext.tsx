import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket, getSocket } from '../lib/socket';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  error: null,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect socket if user is not authenticated
      if (socket) {
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const connectSocket = async () => {
      try {
        const newSocket = await initializeSocket();
        setSocket(newSocket);

        // Set up event listeners
        newSocket.on('connect', () => {
          console.log('Socket connected!', newSocket.id);
          setIsConnected(true);
          setError(null);
        });

        newSocket.on('connected', (data) => {
          console.log('Server confirmed connection:', data);
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setError(err.message);
          setIsConnected(false);
        });

        newSocket.on('user:online', (data) => {
          console.log('User came online:', data.userId);
        });

        newSocket.on('user:offline', (data) => {
          console.log('User went offline:', data.userId);
        });

        newSocket.on('user:typing', (data) => {
          console.log('User typing:', data);
        });

      } catch (err: any) {
        console.error('Failed to initialize socket:', err);
        setError(err.message);
      }
    };

    connectSocket();

    // Cleanup on unmount or when auth changes
    return () => {
      if (socket) {
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};
