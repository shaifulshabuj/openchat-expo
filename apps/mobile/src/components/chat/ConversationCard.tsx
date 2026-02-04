import React from 'react';
import { Box, HStack, VStack, Text, Avatar, Badge, Pressable } from 'native-base';
import { formatDistanceToNow } from 'date-fns';

type ConversationCardProps = {
  conversation: {
    id: string;
    name?: string;
    isGroup: boolean;
    lastMessage?: {
      id: string;
      content: string | null;
      senderId: string;
      senderName: string;
      createdAt: Date;
      type: string;
    };
    lastMessageAt?: Date;
    unreadCount: number;
    participants: Array<{
      id: string;
      userId: string;
      user: {
        id: string;
        username: string;
        email: string;
        displayName?: string | null;
        avatar?: string | null;
      };
    }>;
  };
  onPress: () => void;
};

export default function ConversationCard({ conversation, onPress }: ConversationCardProps) {
  // Get conversation display info
  const getConversationInfo = () => {
    if (conversation.isGroup) {
      return {
        name: conversation.name || 'Group Chat',
        avatar: undefined, // TODO: Group avatar
      };
    }

    // For 1-on-1, get the other participant
    const otherParticipant = conversation.participants[0]?.user;
    if (!otherParticipant) {
      return { name: 'Unknown', avatar: undefined };
    }

    const { displayName, username, avatar } = otherParticipant;
    const name = displayName || username;

    return {
      name,
      avatar,
    };
  };

  const { name, avatar } = getConversationInfo();

  // Format last message preview
  const getLastMessagePreview = () => {
    if (!conversation.lastMessage) {
      return 'No messages yet';
    }

    const { content, type } = conversation.lastMessage;

    if (type === 'TEXT') {
      return content || 'Message';
    }

    // Media message previews
    const mediaTypeMap: Record<string, string> = {
      IMAGE: '📷 Photo',
      VIDEO: '🎥 Video',
      VOICE: '🎤 Voice message',
      FILE: '📎 File',
    };

    return mediaTypeMap[type] || 'Message';
  };

  // Format timestamp
  const getTimestamp = () => {
    if (!conversation.lastMessageAt) {
      return '';
    }

    return formatDistanceToNow(new Date(conversation.lastMessageAt), {
      addSuffix: false,
    });
  };

  return (
    <Pressable onPress={onPress}>
      {({ isPressed }) => (
        <Box
          bg={isPressed ? 'gray.100' : 'white'}
          borderRadius="md"
          px={3}
          py={3}
        >
          <HStack space={3} alignItems="center">
            {/* Avatar */}
            <Avatar
              size="md"
              source={avatar ? { uri: avatar } : undefined}
              bg="primary.500"
            >
              {name.substring(0, 2).toUpperCase()}
            </Avatar>

            {/* Content */}
            <VStack flex={1} space={1}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text
                  fontSize="md"
                  fontWeight={conversation.unreadCount > 0 ? 'bold' : 'normal'}
                  numberOfLines={1}
                  flex={1}
                >
                  {name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {getTimestamp()}
                </Text>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Text
                  fontSize="sm"
                  color={conversation.unreadCount > 0 ? 'gray.800' : 'gray.500'}
                  fontWeight={conversation.unreadCount > 0 ? '500' : 'normal'}
                  numberOfLines={1}
                  flex={1}
                >
                  {getLastMessagePreview()}
                </Text>
                {conversation.unreadCount > 0 && (
                  <Badge
                    colorScheme="primary"
                    rounded="full"
                    variant="solid"
                    alignSelf="center"
                    _text={{ fontSize: 10 }}
                  >
                    {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>
        </Box>
      )}
    </Pressable>
  );
}
