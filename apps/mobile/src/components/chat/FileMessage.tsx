import React from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { HStack, VStack, Text, Icon, IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface FileMessageProps {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType?: string;
}

export const FileMessage: React.FC<FileMessageProps> = ({ 
  fileUrl, 
  fileName, 
  fileSize,
  mimeType = 'application/octet-stream'
}) => {
  const getFileIcon = (): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return 'picture-as-pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table-chart';
      case 'ppt':
      case 'pptx':
        return 'slideshow';
      case 'zip':
      case 'rar':
      case '7z':
        return 'folder-zip';
      case 'txt':
        return 'text-snippet';
      case 'csv':
        return 'grid-on';
      default:
        return 'insert-drive-file';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleDownload = async () => {
    try {
      const fileUri = (FileSystem.documentDirectory || '') + fileName;
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        fileUri
      );

      const result = await downloadResumable?.downloadAsync();
      
      if (result) {
        Alert.alert('Success', 'File downloaded successfully', [
          {
            text: 'Share',
            onPress: async () => {
              const canShare = await Sharing.isAvailableAsync();
              if (canShare) {
                await Sharing.shareAsync(result.uri);
              }
            },
          },
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file');
    }
  };

  return (
    <HStack
      space={3}
      alignItems="center"
      bg="gray.100"
      p={3}
      borderRadius="md"
      maxWidth={250}
    >
      <Icon as={MaterialIcons} name={getFileIcon()} size="xl" color="primary.500" />
      
      <VStack flex={1}>
        <Text fontSize="sm" fontWeight="500" numberOfLines={1}>
          {fileName}
        </Text>
        <Text fontSize="xs" color="gray.600">
          {formatFileSize(fileSize)}
        </Text>
      </VStack>

      <IconButton
        icon={<Icon as={MaterialIcons} name="download" size="md" />}
        onPress={handleDownload}
        variant="ghost"
        size="sm"
      />
    </HStack>
  );
};
