import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Image, Modal, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

interface MediaMessageProps {
  mediaUrl: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl?: string;
}

export const MediaMessage: React.FC<MediaMessageProps> = ({ 
  mediaUrl, 
  type,
  thumbnailUrl 
}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  if (type === 'IMAGE') {
    return (
      <>
        <TouchableOpacity onPress={() => setShowFullScreen(true)}>
          <Image
            source={{ uri: mediaUrl }}
            alt="Image"
            width={200}
            height={150}
            borderRadius="md"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <Modal isOpen={showFullScreen} onClose={() => setShowFullScreen(false)} size="full">
          <Modal.Content maxWidth="100%" maxHeight="100%" bg="black">
            <Modal.CloseButton />
            <Modal.Body p={0}>
              <Image
                source={{ uri: mediaUrl }}
                alt="Full Image"
                width="100%"
                height="100%"
                resizeMode="contain"
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </>
    );
  }

  // VIDEO type
  return (
    <>
      <TouchableOpacity onPress={() => setShowVideoPlayer(true)}>
        <Box position="relative" width={200} height={150} borderRadius="md" overflow="hidden">
          <Image
            source={{ uri: thumbnailUrl || mediaUrl }}
            alt="Video thumbnail"
            width="100%"
            height="100%"
            resizeMode="cover"
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
          >
            <Box
              bg="rgba(0,0,0,0.6)"
              borderRadius="full"
              p={3}
            >
              <Icon as={MaterialIcons} name="play-arrow" size="xl" color="white" />
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>

      <Modal isOpen={showVideoPlayer} onClose={() => setShowVideoPlayer(false)} size="full">
        <Modal.Content maxWidth="100%" maxHeight="100%" bg="black">
          <Modal.CloseButton />
          <Modal.Body p={0} justifyContent="center">
            <Video
              source={{ uri: mediaUrl }}
              style={{ width: '100%', height: 400 }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};
