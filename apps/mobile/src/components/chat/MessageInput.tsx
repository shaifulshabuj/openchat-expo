import React, { useState, useEffect, useRef } from 'react';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { HStack, VStack, IconButton, useToast, Icon, Spinner } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { trpcClient } from '@/utils/trpc';
import { useSocket } from '@/src/contexts/SocketContext';

interface MessageInputProps {
  conversationId: string;
  onMessageSent?: (message: any) => void;
}

export default function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();
  const { socket } = useSocket();

  // Emit typing indicator (debounced)
  useEffect(() => {
    if (text.length > 0) {
      // User is typing
      socket?.emit('typing:start', { conversationId });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit('typing:stop', { conversationId });
      }, 1000);
    } else {
      // Input cleared, stop typing immediately
      socket?.emit('typing:stop', { conversationId });
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text, conversationId, socket]);

  const handleSend = async () => {
    if (!text.trim() || isSending) return;

    const messageText = text.trim();
    setText('');
    setInputHeight(40);
    setIsSending(true);

    // Stop typing indicator
    socket?.emit('typing:stop', { conversationId });

    try {
      const message = await trpcClient.message.send.mutate({
        conversationId,
        content: messageText,
        type: 'TEXT',
        senderId: '', // Will be filled by backend from JWT
      });

      // Callback for optimistic update
      onMessageSent?.(message);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.show({
        description: 'Failed to send message. Please try again.',
        duration: 3000,
      });
      // Restore text on error
      setText(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const handleContentSizeChange = (event: any) => {
    const height = event.nativeEvent.contentSize.height;
    // Auto-grow with max height of 100px
    setInputHeight(Math.min(Math.max(40, height), 100));
  };

  const handleCameraPress = () => {
    // TODO: Implement in Task 40
    toast.show({
      description: 'Camera feature coming in Task 40!',
      duration: 2000,
    });
  };

  const handleGalleryPress = () => {
    // TODO: Implement in Task 40
    toast.show({
      description: 'Gallery feature coming in Task 40!',
      duration: 2000,
    });
  };

  const handleFilePress = () => {
    // TODO: Implement in Task 41
    toast.show({
      description: 'File attachment coming in Task 41!',
      duration: 2000,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <HStack
        p={2}
        bg="white"
        borderTopWidth={1}
        borderTopColor="gray.200"
        alignItems="flex-end"
        space={2}
      >
        {/* Media attachment buttons */}
        <HStack space={1}>
          <IconButton
            icon={<Icon as={MaterialIcons} name="camera-alt" size="md" color="gray.600" />}
            onPress={handleCameraPress}
            isDisabled={isSending}
            variant="ghost"
            size="sm"
          />
          <IconButton
            icon={<Icon as={MaterialIcons} name="photo" size="md" color="gray.600" />}
            onPress={handleGalleryPress}
            isDisabled={isSending}
            variant="ghost"
            size="sm"
          />
          <IconButton
            icon={<Icon as={MaterialIcons} name="attach-file" size="md" color="gray.600" />}
            onPress={handleFilePress}
            isDisabled={isSending}
            variant="ghost"
            size="sm"
          />
        </HStack>

        {/* Text input */}
        <VStack flex={1}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            multiline
            onContentSizeChange={handleContentSizeChange}
            style={{
              minHeight: 40,
              maxHeight: 100,
              height: inputHeight,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: '#f5f5f5',
              fontSize: 16,
            }}
            editable={!isSending}
          />
        </VStack>

        {/* Send button */}
        <IconButton
          icon={
            isSending ? (
              <Spinner size="sm" color="primary.500" />
            ) : (
              <Icon as={MaterialIcons} name="send" size="lg" color="primary.500" />
            )
          }
          onPress={handleSend}
          isDisabled={!text.trim() || isSending}
          variant="ghost"
          size="lg"
        />
      </HStack>
    </KeyboardAvoidingView>
  );
}
