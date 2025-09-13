import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { ContentTypeAndData } from '@/src/components/qr-io-frames-types';

export interface SharedFileData {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
  content: ContentTypeAndData;
}

export const useIOSFileIntent = () => {
  const [sharedFile, setSharedFile] = useState<SharedFileData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processSharedFile = async (uri: string, name?: string, mimeType?: string): Promise<SharedFileData | null> => {
    try {
      setIsProcessing(true);
      
      // For iOS, we need to handle different URI schemes
      let fileUri = uri;
      
      // Handle content:// URLs (from iOS share sheet)
      if (uri.startsWith('content://')) {
        // For content:// URLs, we need to use the FileSystem API differently
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }
        fileUri = uri;
      } else if (uri.startsWith('file://')) {
        // Handle file:// URLs
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }
        fileUri = uri;
      } else {
        // Handle other schemes
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }
        fileUri = uri;
      }

      const fileName = name || fileUri.split('/').pop() || 'shared-file';
      const fileMimeType = mimeType || 'application/octet-stream';

      // Read file content
      let fileBytes: Uint8Array;
      
      if (Platform.OS === 'web') {
        // For web, we need to fetch the file as a blob first
        const response = await fetch(fileUri);
        const arrayBuffer = await response.arrayBuffer();
        fileBytes = new Uint8Array(arrayBuffer);
      } else {
        // For native platforms, read the file directly
        const fsFile = new FileSystem.File(fileUri);
        fileBytes = fsFile.bytesSync();
      }

      // Get file size
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const fileSize = (fileInfo as any).size || fileBytes.length;

      // Create content object
      const content: ContentTypeAndData = {
        contentTitle: `qr-io-shared-${fileName}`,
        contentMimeType: fileMimeType,
        content: {
          oneofKind: 'bytesContent',
          bytesContent: fileBytes,
        },
        contentLength: fileBytes.length,
      };

      const sharedFileData: SharedFileData = {
        uri: fileUri,
        name: fileName,
        mimeType: fileMimeType,
        size: fileSize,
        content,
      };

      return sharedFileData;
    } catch (error) {
      console.error('Error processing shared file:', error);
      Alert.alert('Error', 'Failed to process shared file');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIOSIntent = async (url: string) => {
    if (Platform.OS !== 'ios') {
      return;
    }

    try {
      const parsedUrl = Linking.parse(url);
      
      // Handle different iOS URL schemes
      if (parsedUrl.scheme === 'file' || 
          parsedUrl.scheme === 'content' || 
          parsedUrl.hostname === 'file') {
        
        let fileUri = parsedUrl.path || url;
        
        // For content:// URLs, use the full URL
        if (parsedUrl.scheme === 'content') {
          fileUri = url;
        }
        
        const fileName = parsedUrl.path?.split('/').pop();
        
        const sharedFileData = await processSharedFile(fileUri, fileName);
        if (sharedFileData) {
          setSharedFile(sharedFileData);
        }
      }
    } catch (error) {
      console.error('Error handling iOS intent:', error);
    }
  };

  useEffect(() => {
    // Handle initial URL (app opened with intent)
    const getInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await handleIOSIntent(initialUrl);
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    getInitialUrl();

    // Handle URL changes (app already running)
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleIOSIntent(url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const clearSharedFile = () => {
    setSharedFile(null);
  };

  return {
    sharedFile,
    isProcessing,
    clearSharedFile,
  };
};
