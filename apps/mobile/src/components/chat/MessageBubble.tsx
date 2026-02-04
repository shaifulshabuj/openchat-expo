import React from 'react';
import { Box, HStack, VStack, Text, Avatar, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { format, formatDistanceToNow } from 'date-fns';

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

type MessageBubbleProps = {
  message: Message;
  isSent: boolean;
  showAvatar?: boolean;
  showSenderName?: boolean;
};

export default function MessageBubble({
  message,
  isSent,
  showAvatar = true,
  showSenderName = false,
}: MessageBubbleProps) {
  const getStatusIcon = () => {
    if (!isSent) return null;

    if (message.seenAt) {
      return <Icon as={MaterialIcons} name="done-all" size="xs" color="blue.500" />;
    }
    if (message.deliveredAt) {
      return <Icon as={MaterialIcons} name="done-all" size="xs" color="gray.500" />;
    }
    return <Icon as={MaterialIcons} name="done" size="xs" color="gray.500" />;
  };

  const getMessagePreview = () => {
    switch (message.type) {
      case 'IMAGE':
        return (
          <HStack space={1} alignItems="center">
            <Icon as={MaterialIcons} name="image" size="sm" />
            <Text>Photo</Text>
          </HStack>
        );
      case 'VIDEO':
        return (
          <HStack space={1} alignItems="center">
            <Icon as={MaterialIcons} name="videocam" size="sm" />
            <Text>Video</Text>
          </HStack>
        );
      case 'FILE':
        return (
          <HStack space={1} alignItems="center">
            <Icon as={MaterialIcons} name="insert-drive-file" size="sm" />
            <Text>File</Text>
          </HStack>
        );
      case 'VOICE':
        return (
          <HStack space={1} alignItems="center">
            <Icon as={MaterialIcons} name="mic" size="sm" />
            <Text>Voice message</Text>
          </HStack>
        );
      default:
        return <Text>{message.content}</Text>;
    }
  };

  const timestamp = format(message.createdAt, 'HH:mm');

  if (isSent) {
    return (
      <HStack justifyContent="flex-end" mb={2} px={4}>
        <Box maxW="80%">
          <Box
            bg="primary.500"
            px={3}
            py={2}
            borderRadius="lg"
            borderBottomRightRadius="sm"
          >
            <VStack space={1}>
              {message.type === 'TEXT' ? (
                <Text color="white" fontSize="md">
                  {message.content}
                </Text>
              ) : (
                <Box color="white">{getMessagePreview()}</Box>
              )}
            </VStack>
          </Box>

          <HStack justifyContent="flex-end" space={1} mt={1} alignItems="center">
            {message.editedAt && (
              <Text fontSize="xs" color="gray.400">
                edited •
              </Text>
            )}
            <Text fontSize="xs" color="gray.500">
              {timestamp}
            </Text>
            {getStatusIcon()}
          </HStack>
        </Box>
      </HStack>
    );
  }

  return (
    <HStack space={2} mb={2} px={4} alignItems="flex-end">
      {showAvatar ? (
        <Avatar
          size="sm"
          source={message.sender.avatar ? { uri: message.sender.avatar } : undefined}
          bg="gray.400"
        >
          {message.sender.name.charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Box w={8} />
      )}

      <Box maxW="75%">
        {showSenderName && (
          <Text fontSize="xs" color="gray.600" mb={1} ml={1}>
            {message.sender.name}
          </Text>
        )}

        <Box bg="white" px={3} py={2} borderRadius="lg" borderBottomLeftRadius="sm" shadow={1}>
          <VStack space={1}>
            {message.type === 'TEXT' ? (
              <Text color="gray.800" fontSize="md">
                {message.content}
              </Text>
            ) : (
              <Box color="gray.800">{getMessagePreview()}</Box>
            )}
          </VStack>
        </Box>

        <HStack space={1} mt={1} ml={1}>
          {message.editedAt && (
            <Text fontSize="xs" color="gray.400">
              edited •
            </Text>
          )}
          <Text fontSize="xs" color="gray.500">
            {timestamp}
          </Text>
        </HStack>
      </Box>
    </HStack>
  );
}
