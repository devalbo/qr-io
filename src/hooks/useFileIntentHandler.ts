import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { ContentTypeAndData } from '@/src/components/qr-io-frames-types';
import { useIOSFileIntent } from './useIOSFileIntent';

export interface SharedFileData {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
  content: ContentTypeAndData;
}

export const useFileIntentHandler = () => {
  // Use platform-specific handlers
  const iosHandler = useIOSFileIntent();
  
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
      const fileSize = (fileInfo as any).size || 0;

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
          oneofKind: 'bytesContent',
          bytesContent: fileBytes,
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
        const uri = intent.data || intent.extra?.android?.intent?.extra?.STREAM;
        const mimeType = intent.type || intent.extra?.android?.intent?.extra?.STREAM_TYPE;
        const fileName = intent.extra?.android?.intent?.extra?.SUBJECT || 
                        intent.extra?.android?.intent?.extra?.TEXT ||
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

  const handleLinkingIntent = async (url: string) => {
    try {
      const parsedUrl = Linking.parse(url);
      
      // Handle file sharing intents
      if (parsedUrl.scheme === 'file' || parsedUrl.hostname === 'file' || parsedUrl.scheme === 'content') {
        let fileUri = parsedUrl.path || url;
        
        // For iOS, we might get content:// URLs that need special handling
        if (parsedUrl.scheme === 'content') {
          fileUri = url; // Use the full URL for content:// schemes
        }
        
        const fileName = parsedUrl.path?.split('/').pop();
        
        const sharedFileData = await processSharedFile(fileUri, fileName);
        if (sharedFileData) {
          setSharedFile(sharedFileData);
        }
      }
    } catch (error) {
      console.error('Error handling linking intent:', error);
    }
  };

  useEffect(() => {
    // Use platform-specific handlers
    if (Platform.OS === 'ios') {
      // iOS handler is already set up in useIOSFileIntent
      setSharedFile(iosHandler.sharedFile);
      setIsProcessing(iosHandler.isProcessing);
    } else {
      // Handle Android intents
      handleAndroidIntent();

      // Handle initial URL (app opened with intent)
      const getInitialUrl = async () => {
        try {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            await handleLinkingIntent(initialUrl);
          }
        } catch (error) {
          console.error('Error getting initial URL:', error);
        }
      };

      getInitialUrl();

      // Handle URL changes (app already running)
      const subscription = Linking.addEventListener('url', ({ url }) => {
        handleLinkingIntent(url);
      });

      return () => {
        subscription?.remove();
      };
    }
  }, [iosHandler.sharedFile, iosHandler.isProcessing]);

  const clearSharedFile = () => {
    if (Platform.OS === 'ios') {
      iosHandler.clearSharedFile();
    } else {
      setSharedFile(null);
    }
  };

  return {
    sharedFile: Platform.OS === 'ios' ? iosHandler.sharedFile : sharedFile,
    isProcessing: Platform.OS === 'ios' ? iosHandler.isProcessing : isProcessing,
    clearSharedFile,
  };
};
