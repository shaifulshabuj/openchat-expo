import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Box, VStack, Spinner, Center, Text } from 'native-base';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isSameDay } from 'date-fns';
import ChatHeader from '../../../src/components/chat/ChatHeader';
import MessageBubble from '../../../src/components/chat/MessageBubble';
import MessageDateSeparator from '../../../src/components/chat/MessageDateSeparator';
import TypingIndicator from '../../../src/components/chat/TypingIndicator';
import MessageInput from '../../../src/components/chat/MessageInput';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useSocketEvents } from '../../../src/hooks/useSocketEvents';

type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'VOICE';

type Message = {
  id: string;
  content?: string;
  type: MessageType;
  mediaUrl?: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  deliveredAt?: Date;
  seenAt?: Date;
  editedAt?: Date;
};

type User = {
  id: string;
  name: string;
  avatar?: string;
};

export default function ChatScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hey! How are you?',
        type: 'TEXT',
        senderId: 'user2',
        sender: { id: 'user2', name: 'John Doe', avatar: undefined },
        createdAt: new Date(Date.now() - 3600000),
        deliveredAt: new Date(Date.now() - 3500000),
        seenAt: new Date(Date.now() - 3400000),
      },
      {
        id: '2',
        content: "I'm doing great! Thanks for asking.",
        type: 'TEXT',
        senderId: user?.id || 'user1',
        sender: { id: user?.id || 'user1', name: user?.displayName || user?.username || 'Me', avatar: user?.avatar || undefined },
        createdAt: new Date(Date.now() - 3000000),
        deliveredAt: new Date(Date.now() - 2900000),
        seenAt: new Date(Date.now() - 2800000),
      },
      {
        id: '3',
        content: 'Want to grab coffee later?',
        type: 'TEXT',
        senderId: 'user2',
        sender: { id: 'user2', name: 'John Doe', avatar: undefined },
        createdAt: new Date(Date.now() - 1800000),
        deliveredAt: new Date(Date.now() - 1700000),
      },
      {
        id: '4',
        content: 'Sure! What time works for you?',
        type: 'TEXT',
        senderId: user?.id || 'user1',
        sender: { id: user?.id || 'user1', name: user?.displayName || user?.username || 'Me', avatar: user?.avatar || undefined },
        createdAt: new Date(Date.now() - 300000),
        deliveredAt: new Date(Date.now() - 200000),
      },
      {
        id: '5',
        content: 'How about 3 PM?',
        type: 'TEXT',
        senderId: 'user2',
        sender: { id: 'user2', name: 'John Doe', avatar: undefined },
        createdAt: new Date(Date.now() - 60000),
      },
    ];

    setOtherUser({ id: 'user2', name: 'John Doe', avatar: undefined });
    setMessages(mockMessages.reverse()); // Newest at end for inverted list
    setIsLoading(false);
  }, [user]);

  // Socket.io event handlers
  useSocketEvents({
    onMessageNew: (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message as any]);
        // Auto-scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    },
    onMessageUpdated: (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === data.messageId ? { ...m, ...data.updates } : m))
        );
      }
    },
    onMessageDeleted: (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
      }
    },
    onUserTyping: (data) => {
      if (data.conversationId === conversationId && data.userId !== user?.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    },
  });

  // Group messages by date
  const messagesWithDates = useMemo(() => {
    const result: Array<{ type: 'date' | 'message'; data: any }> = [];
    let lastDate: Date | null = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);

      if (!lastDate || !isSameDay(lastDate, messageDate)) {
        result.push({ type: 'date', data: messageDate });
        lastDate = messageDate;
      }

      result.push({ type: 'message', data: message });
    });

    return result;
  }, [messages]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Implement pull-to-refresh with tRPC
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleLoadMore = () => {
    if (!hasMore || isLoading) return;
    // TODO: Implement pagination with cursor
  };

  const handleMessageSent = (message: any) => {
    // Add message to list (optimistic update)
    setMessages((prev) => [...prev, message]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (item.type === 'date') {
      return <MessageDateSeparator date={item.data} />;
    }

    const message = item.data as Message;
    const isSent = message.senderId === user?.id;
    const prevItem = messagesWithDates[index - 1];
    const prevMessage = prevItem?.type === 'message' ? prevItem.data : null;
    const showAvatar = !isSent && (!prevMessage || prevMessage.senderId !== message.senderId);
    const showSenderName = !isSent && showAvatar;

    return (
      <MessageBubble
        message={message}
        isSent={isSent}
        showAvatar={showAvatar}
        showSenderName={showSenderName}
      />
    );
  };

  if (isLoading) {
    return (
      <VStack flex={1} bg="gray.50">
        <ChatHeader name="Loading..." />
        <Center flex={1}>
          <Spinner size="lg" />
        </Center>
      </VStack>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <VStack flex={1} bg="gray.50">
        <ChatHeader
          name={otherUser?.name || 'Chat'}
          avatar={otherUser?.avatar}
          isOnline={false}
        />

        <FlatList
          ref={flatListRef}
          data={messagesWithDates}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === 'date' ? `date-${index}` : `message-${item.data.id}`
          }
          inverted
          contentContainerStyle={{ paddingVertical: 8 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={
            isTyping ? (
              <Box alignSelf="flex-start" bg="white" borderRadius="lg" mx={4} mb={2} shadow={1}>
                <TypingIndicator />
              </Box>
            ) : null
          }
        />

        <MessageInput conversationId={conversationId!} onMessageSent={handleMessageSent} />
      </VStack>
    </KeyboardAvoidingView>
  );
}
