import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

export interface SocketEventHandlers {
  // Message events
  onMessageNew?: (data: any) => void;
  onMessageUpdated?: (data: any) => void;
  onMessageDeleted?: (data: any) => void;
  onMessageRead?: (data: any) => void;
  
  // Reaction events
  onReactionAdded?: (data: any) => void;
  onReactionRemoved?: (data: any) => void;
  
  // User presence events
  onUserOnline?: (data: any) => void;
  onUserOffline?: (data: any) => void;
  onUserTyping?: (data: any) => void;
}

/**
 * Hook to register socket event listeners
 */
export const useSocketEvents = (handlers: SocketEventHandlers) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Message events
    if (handlers.onMessageNew) {
      socket.on('message:new', handlers.onMessageNew);
    }
    if (handlers.onMessageUpdated) {
      socket.on('message:updated', handlers.onMessageUpdated);
    }
    if (handlers.onMessageDeleted) {
      socket.on('message:deleted', handlers.onMessageDeleted);
    }
    if (handlers.onMessageRead) {
      socket.on('message:read', handlers.onMessageRead);
    }

    // Reaction events
    if (handlers.onReactionAdded) {
      socket.on('reaction:added', handlers.onReactionAdded);
    }
    if (handlers.onReactionRemoved) {
      socket.on('reaction:removed', handlers.onReactionRemoved);
    }

    // User presence events
    if (handlers.onUserOnline) {
      socket.on('user:online', handlers.onUserOnline);
    }
    if (handlers.onUserOffline) {
      socket.on('user:offline', handlers.onUserOffline);
    }
    if (handlers.onUserTyping) {
      socket.on('user:typing', handlers.onUserTyping);
    }

    // Cleanup listeners on unmount
    return () => {
      socket.off('message:new');
      socket.off('message:updated');
      socket.off('message:deleted');
      socket.off('message:read');
      socket.off('reaction:added');
      socket.off('reaction:removed');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('user:typing');
    };
  }, [socket, isConnected, handlers]);
};
