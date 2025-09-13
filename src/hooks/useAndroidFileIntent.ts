import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { ContentTypeAndData } from '@/src/components/qr-io-frames-types';
import { SharedFileData } from './useFileSharingIntent';

// This hook handles Android-specific intent extras for file sharing
export const useAndroidFileIntent = () => {
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

  const handleAndroidIntent = async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      // Check if the app was opened with an intent
      const intent = (global as any).__expo_intent;
      if (intent && intent.action === 'android.intent.action.SEND') {
        const uri = intent.data || intent.extra?.android.intent.extra.STREAM;
        const mimeType = intent.type || intent.extra?.android.intent.extra.STREAM_TYPE;
        const fileName = intent.extra?.android.intent.extra.SUBJECT || 
                        intent.extra?.android.intent.extra.TEXT ||
                        'shared-file';

        if (uri) {
          const sharedFileData = await processSharedFile(uri, fileName, mimeType);
          if (sharedFileData) {
            setSharedFile(sharedFileData);
          }
        }
      }
    } catch (error) {
      console.error('Error handling Android intent:', error);
    }
  };

  useEffect(() => {
    handleAndroidIntent();
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
