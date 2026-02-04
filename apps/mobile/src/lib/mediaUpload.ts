import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
}

export const uploadMedia = async (
  uri: string,
  type: 'IMAGE' | 'VIDEO',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  const formData = new FormData();
  
  // Extract filename from URI
  const filename = uri.split('/').pop() || 'media';
  const match = /\.(\w+)$/.exec(filename);
  const fileType = match ? `${type.toLowerCase()}/${match[1]}` : `${type.toLowerCase()}/jpeg`;

  // Append file to FormData
  formData.append('file', {
    uri,
    name: filename,
    type: fileType,
  } as any);

  try {
    const response = await axios.post(`${API_URL}/media/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage,
          });
        }
      },
    });

    return {
      url: response.data.url,
      thumbnailUrl: response.data.thumbnailUrl,
      fileSize: response.data.fileSize,
      mimeType: response.data.mimeType,
    };
  } catch (error) {
    console.error('Media upload failed:', error);
    throw new Error('Failed to upload media. Please try again.');
  }
};
