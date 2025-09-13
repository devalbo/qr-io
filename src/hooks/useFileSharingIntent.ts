import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import { ContentTypeAndData } from '@/src/components/qr-io-frames-types';

export interface SharedFileData {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
  content: ContentTypeAndData;
}

export const useFileSharingIntent = () => {
  const [sharedFile, setSharedFile] = useState<SharedFileData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processSharedFile = async (uri: string, name?: string, mimeType?: string): Promise<SharedFileData | null> => {
    try {
      setIsProcessing(true);
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const fileName = name || fileInfo.uri.split('/').pop() || 'shared-file';
      const fileMimeType = mimeType || 'application/octet-stream';
      const fileSize = fileInfo.size || 0;

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

      const sharedFileData: SharedFileData = {
        uri,
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

  const handleIntent = async (url: string) => {
    try {
      const parsedUrl = Linking.parse(url);
      
      // Handle file sharing intents
      if (parsedUrl.scheme === 'file' || parsedUrl.hostname === 'file') {
        const fileUri = parsedUrl.path || url;
        const fileName = parsedUrl.path?.split('/').pop();
        
        const sharedFileData = await processSharedFile(fileUri, fileName);
        if (sharedFileData) {
          setSharedFile(sharedFileData);
        }
      }
    } catch (error) {
      console.error('Error handling intent:', error);
    }
  };

  useEffect(() => {
    // Handle initial URL (app opened with intent)
    const getInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await handleIntent(initialUrl);
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    getInitialUrl();

    // Handle URL changes (app already running)
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleIntent(url);
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
