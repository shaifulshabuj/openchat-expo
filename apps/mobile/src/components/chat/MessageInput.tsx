import React, { useState, useEffect, useRef } from 'react';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { HStack, VStack, IconButton, useToast, Icon, Spinner, Progress, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { trpcClient } from '@/utils/trpc';
import { useSocket } from '@/src/contexts/SocketContext';
import { MediaPicker } from './MediaPicker';
import { VoiceRecorder } from './VoiceRecorder';
import { DocumentPickerComponent } from './DocumentPickerComponent';
import { uploadMedia, uploadFile, uploadVoice, UploadProgress } from '../../lib/mediaUpload';
import { useShouldDisableMediaUpload } from '../../hooks/useShouldDisableMediaUpload';

interface MessageInputProps {
  conversationId: string;
  onMessageSent?: (message: any) => void;
}

export default function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();
  const { socket } = useSocket();
  
  // Check if media/file upload should be disabled (iOS devices and macOS PWA)
  const shouldDisableMediaUpload = useShouldDisableMediaUpload();

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

  const handleMediaSelected = async (media: {
    uri: string;
    type: 'IMAGE' | 'VIDEO';
    fileSize: number;
    fileName: string;
  }) => {
    setIsSending(true);
    setUploadProgress(0);

    try {
      // Upload media with progress tracking
      const uploadResult = await uploadMedia(media.uri, media.type, (progress: UploadProgress) => {
        setUploadProgress(progress.percentage);
      });

      // Send message with media URL
      const message = await trpcClient.message.send.mutate({
        conversationId,
        content: media.type === 'IMAGE' ? '📷 Image' : '🎥 Video',
        type: media.type,
        mediaUrl: uploadResult.url,
        senderId: '',
      });

      onMessageSent?.(message);
      setUploadProgress(null);
    } catch (error) {
      console.error('Failed to send media:', error);
      toast.show({
        description: 'Failed to send media. Please try again.',
        duration: 3000,
      });
      setUploadProgress(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleDocumentSelected = async (doc: {
    uri: string;
    name: string;
    size: number;
    mimeType: string;
  }) => {
    setIsSending(true);
    setUploadProgress(0);

    try {
      const uploadResult = await uploadFile(
        doc.uri,
        doc.name,
        doc.mimeType,
        (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        }
      );

      const message = await trpcClient.message.send.mutate({
        conversationId,
        content: `📎 ${doc.name}`,
        type: 'FILE',
        mediaUrl: uploadResult.url,
        senderId: '',
      });

      onMessageSent?.(message);
      setUploadProgress(null);
    } catch (error) {
      console.error('Failed to send file:', error);
      toast.show({
        description: 'Failed to send file. Please try again.',
        duration: 3000,
      });
      setUploadProgress(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleRecordingComplete = async (uri: string, duration: number) => {
    setIsSending(true);
    setUploadProgress(0);

    try {
      const uploadResult = await uploadVoice(uri, duration, (progress: UploadProgress) => {
        setUploadProgress(progress.percentage);
      });

      const message = await trpcClient.message.send.mutate({
        conversationId,
        content: `🎤 Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
        type: 'VOICE',
        mediaUrl: uploadResult.url,
        senderId: '',
      });

      onMessageSent?.(message);
      setUploadProgress(null);
    } catch (error) {
      console.error('Failed to send voice:', error);
      toast.show({
        description: 'Failed to send voice message. Please try again.',
        duration: 3000,
      });
      setUploadProgress(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {uploadProgress !== null && (
        <VStack px={4} py={2} bg="white">
          <Text fontSize="xs" color="gray.600" mb={1}>
            Uploading... {uploadProgress}%
          </Text>
          <Progress value={uploadProgress} size="sm" colorScheme="primary" />
        </VStack>
      )}
      <HStack
        p={2}
        bg="white"
        borderTopWidth={1}
        borderTopColor="gray.200"
        alignItems="flex-end"
        space={2}
      >
        {/* Media attachment buttons - hidden on iOS devices and macOS PWA due to security restrictions */}
        {!shouldDisableMediaUpload && (
          <>
            <MediaPicker onMediaSelected={handleMediaSelected} disabled={isSending} />
            <DocumentPickerComponent onDocumentSelected={handleDocumentSelected} disabled={isSending} />
          </>
        )}
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} disabled={isSending} />

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
