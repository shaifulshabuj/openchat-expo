import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconButton, HStack, Modal, VStack, Text, Image, Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

interface MediaPickerProps {
  onMediaSelected: (media: {
    uri: string;
    type: 'IMAGE' | 'VIDEO';
    fileSize: number;
    fileName: string;
  }) => void;
  disabled?: boolean;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ 
  onMediaSelected, 
  disabled = false 
}) => {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [showPreview, setShowPreview] = useState(false);

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  const requestPermissions = async (type: 'camera' | 'library'): Promise<boolean> => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required.');
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required.');
        return false;
      }
    }
    return true;
  };

  const handleCamera = async () => {
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileSize = asset.fileSize || 0;
      const maxSize = asset.type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

      if (fileSize > maxSize) {
        Alert.alert('File Too Large', `Maximum size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      setPreviewUri(asset.uri);
      setPreviewType(asset.type === 'video' ? 'VIDEO' : 'IMAGE');
      setShowPreview(true);
    }
  };

  const handleGallery = async () => {
    const hasPermission = await requestPermissions('library');
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const fileSize = asset.fileSize || 0;
      const maxSize = asset.type === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

      if (fileSize > maxSize) {
        Alert.alert('File Too Large', `Maximum size: ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      setPreviewUri(asset.uri);
      setPreviewType(asset.type === 'video' ? 'VIDEO' : 'IMAGE');
      setShowPreview(true);
    }
  };

  const handleSend = () => {
    if (previewUri) {
      const fileName = previewUri.split('/').pop() || 'media';
      onMediaSelected({
        uri: previewUri,
        type: previewType,
        fileSize: 0,
        fileName,
      });
      setShowPreview(false);
      setPreviewUri(null);
    }
  };

  return (
    <>
      <HStack space={1}>
        <IconButton
          icon={<Icon as={MaterialIcons} name="camera-alt" size="md" color="gray.600" />}
          onPress={handleCamera}
          isDisabled={disabled}
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={<Icon as={MaterialIcons} name="photo" size="md" color="gray.600" />}
          onPress={handleGallery}
          isDisabled={disabled}
          variant="ghost"
          size="sm"
        />
      </HStack>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} size="full">
        <Modal.Content maxWidth="90%">
          <Modal.CloseButton />
          <Modal.Header>Preview</Modal.Header>
          <Modal.Body>
            {previewType === 'IMAGE' && previewUri ? (
              <Image source={{ uri: previewUri }} alt="Preview" width="100%" height={300} />
            ) : (
              <Video
                source={{ uri: previewUri || '' }}
                style={{ width: '100%', height: 300 }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setShowPreview(false)}>
                Cancel
              </Button>
              <Button onPress={handleSend}>
                Send
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};
