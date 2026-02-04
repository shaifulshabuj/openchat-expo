import React from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { IconButton, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface DocumentPickerProps {
  onDocumentSelected: (doc: {
    uri: string;
    name: string;
    size: number;
    mimeType: string;
  }) => void;
  disabled?: boolean;
}

export const DocumentPickerComponent: React.FC<DocumentPickerProps> = ({ 
  onDocumentSelected, 
  disabled = false 
}) => {
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const doc = result.assets[0];
      
      if (doc.size && doc.size > MAX_FILE_SIZE) {
        Alert.alert(
          'File Too Large',
          `Maximum file size is 50MB. Your file is ${(doc.size / (1024 * 1024)).toFixed(2)}MB.`
        );
        return;
      }

      onDocumentSelected({
        uri: doc.uri,
        name: doc.name,
        size: doc.size || 0,
        mimeType: doc.mimeType || 'application/octet-stream',
      });
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  return (
    <IconButton
      icon={<Icon as={MaterialIcons} name="attach-file" size="md" color="gray.600" />}
      onPress={handlePickDocument}
      isDisabled={disabled}
      variant="ghost"
      size="sm"
    />
  );
};
