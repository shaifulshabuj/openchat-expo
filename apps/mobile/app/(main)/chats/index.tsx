import React, { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Center,
} from 'native-base';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSocket } from '../../../src/contexts/SocketContext';
import { useSocketEvents } from '../../../src/hooks/useSocketEvents';
import ConversationCard from '../../../src/components/chat/ConversationCard';
import ConversationListSkeleton from '../../../src/components/chat/ConversationListSkeleton';
import { MaterialIcons } from '@expo/vector-icons';

// Temporary mock data - will be replaced with tRPC when conversation router is added
const mockConversations = [
  {
    id: '1',
    name: 'John Doe',
    isGroup: false,
    lastMessage: {
      id: 'm1',
      content: 'Hey, how are you?',
      senderId: 'user1',
      senderName: 'John Doe',
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      type: 'TEXT',
    },
    lastMessageAt: new Date(Date.now() - 3600000),
    unreadCount: 2,
    participants: [
      {
        id: 'p1',
        userId: 'user1',
        user: {
          id: 'user1',
          username: 'johndoe',
          email: 'john@example.com',
          displayName: 'John Doe',
          avatar: null,
        },
      },
    ],
  },
];

export default function ChatsScreen() {
  const router = useRouter();
  const { isConnected } = useSocket();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);

  // Real-time updates - will be used when Socket.io is integrated
  useSocketEvents({
    onMessageNew: (data: any) => {
      console.log('[Chat List] New message:', data);
      // TODO: Update conversation list
    },
    onMessageRead: (data: any) => {
      console.log('[Chat List] Message read:', data);
      // TODO: Update unread count
    },
  });

  // Pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch conversations from backend
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Navigate to chat screen
  const handleConversationPress = (conversationId: string) => {
    router.push(`/(main)/chats/${conversationId}` as any);
  };

  // Loading state
  if (isLoading && !refreshing) {
    return (
      <Box flex={1} bg="white" safeAreaTop>
        <VStack space={4} px={4} pt={4}>
          <Heading size="lg">Chats</Heading>
          <ConversationListSkeleton count={8} />
        </VStack>
      </Box>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <Box flex={1} bg="white" safeAreaTop>
        <VStack space={4} px={4} pt={4}>
          <Heading size="lg">Chats</Heading>
          <Center flex={1}>
            <VStack space={3} alignItems="center">
              <MaterialIcons name="chat-bubble-outline" size={64} color="#ccc" />
              <Text fontSize="lg" color="gray.500">
                No conversations yet
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Start a new chat to begin messaging
              </Text>
            </VStack>
          </Center>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="white" safeAreaTop>
      <VStack space={4} px={4} pt={4} flex={1}>
        {/* Header */}
        <Heading size="lg">Chats</Heading>

        {/* Connection status */}
        {!isConnected && (
          <Box bg="warning.100" px={3} py={2} borderRadius="md">
            <Text fontSize="sm" color="warning.700">
              ⚠️ Reconnecting to server...
            </Text>
          </Box>
        )}

        {/* Conversation list */}
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationCard
              conversation={item}
              onPress={() => handleConversationPress(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ItemSeparatorComponent={() => <Box h={2} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </Box>
  );
}
