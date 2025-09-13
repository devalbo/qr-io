import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ContentTypeAndData } from '@/src/components/qr-io-frames-types';
import { SharedFileData } from '@/src/hooks/useFileIntentHandler';

/**
 * Processes a shared file and converts it to QR-IO content format
 */
export const processSharedFileToContent = async (
  uri: string, 
  name?: string, 
  mimeType?: string
): Promise<ContentTypeAndData | null> => {
  try {
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const fileName = name || fileInfo.uri.split('/').pop() || 'shared-file';
    const fileMimeType = mimeType || 'application/octet-stream';

    // Read file content
    let fileBytes: Uint8Array;
    
    if (Platform.OS === 'web') {
      // For web, we need to fetch the file as a blob first
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      fileBytes = new Uint8Array(arrayBuffer);
    } else {
      // For native platforms, read the file directly
      const fsFile = new FileSystem.File(uri);
      fileBytes = fsFile.bytesSync();
    }

    // Create content object
    const content: ContentTypeAndData = {
      contentTitle: `qr-io-shared-${fileName}`,
      contentMimeType: fileMimeType,
      content: {
        oneofKind: 'binaryContent',
        binaryContent: fileBytes,
      },
      contentLength: fileBytes.length,
    };

    return content;
  } catch (error) {
    console.error('Error processing shared file:', error);
    return null;
  }
};

/**
 * Determines if a file type is supported for QR generation
 */
export const isSupportedFileType = (mimeType: string): boolean => {
  // Support all file types for now, but you can add restrictions here
  return true;
};

/**
 * Gets a user-friendly file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets a file icon based on MIME type
 */
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('text/')) return '📝';
  if (mimeType.includes('json')) return '📋';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
  return '📁';
};

/**
 * Validates if a shared file is suitable for QR generation
 */
export const validateSharedFile = (sharedFile: SharedFileData): { isValid: boolean; error?: string } => {
  // Check file size (limit to 10MB for now)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (sharedFile.size > maxSize) {
    return {
      isValid: false,
      error: `File size (${formatFileSize(sharedFile.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`
    };
  }

  // Check if file type is supported
  if (!isSupportedFileType(sharedFile.mimeType)) {
    return {
      isValid: false,
      error: `File type ${sharedFile.mimeType} is not supported`
    };
  }

  return { isValid: true };
};
