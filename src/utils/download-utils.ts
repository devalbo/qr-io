import { ContentAcquisitionFrameRecord, ContentAcquisitionStreamRecord } from "@/src/types/database";
import { convertBase64ToBinary, convertBinaryToBase64 } from "./base64-utils";
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { generateQrIoBytesContentHash } from "./qrCodeUtils";

/**
 * Combines all frame data for a stream into a single Uint8Array
 */
export const combineFrameData = (
  stream: ContentAcquisitionStreamRecord,
  frames: ContentAcquisitionFrameRecord[],
): Uint8Array => {
  if (frames.length === 0) {
    console.log('combineFrameData: No frames provided');
    return new Uint8Array(0);
  }

  // Sort frames by frame index to ensure correct order
  const sortedFrames = frames.sort((a, b) => a.contentIndex - b.contentIndex);
  // console.log('combineFrameData: Sorted frames', sortedFrames);
  
  const resultChunks = [];
  let totalSize = 0;
  
  // Copy frame data
  for (const frame of sortedFrames) {
    let frameData: Uint8Array;
    
    if (frame.contentEncoding === 'bytesContentB64') {
      frameData = convertBase64ToBinary(frame.contentData);
      totalSize += frameData.length;
    } else if (frame.contentEncoding === 'textContent') {
      frameData = new TextEncoder().encode(frame.contentData);
      totalSize += frameData.length;
    } else {
      console.warn(`Unknown frame encoding: ${frame.contentEncoding}`);
      continue;
    }
    
    resultChunks.push(frameData);
  }

  const result = new Uint8Array(totalSize);
  let offset = 0;
  for (const chunk of resultChunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result;
};

/**
 * Downloads combined frame data as a file
 */
export const downloadStreamData = async (
  stream: ContentAcquisitionStreamRecord,
  frames: ContentAcquisitionFrameRecord[]
): Promise<void> => {
  try {
    const combinedData = combineFrameData(stream, frames);
    
    if (combinedData.length === 0) {
      throw new Error('No frame data to download');
    }

    const combinedDataHash = await generateQrIoBytesContentHash(combinedData);
    const expectedHash = stream.contentHashB64;

    if (combinedData.length !== stream.contentLength) {
      console.error('Combined data length does not match expected length', combinedData.length, stream.contentLength);
      throw new Error('Combined data length does not match expected length');
    }

    if (combinedDataHash.contentHashB64 !== expectedHash) {
      console.error('Combined data hash does not match expected hash', combinedDataHash.contentHashB64, expectedHash);
      throw new Error('Combined data hash does not match expected hash');
    }

    // Create filename with proper extension based on mime type
    const extension = getFileExtensionFromMimeType(stream.mimeType);
    const filename = `${stream.contentName}${extension}`;
    
    if (Platform.OS === 'web') {
      // Web download
      const blob = new Blob([combinedData], { type: stream.mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Native download using Expo FileSystem
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Convert binary data to base64 for FileSystem.writeAsStringAsync
      const base64Data = convertBinaryToBase64(combinedData);
      
      // Write binary data using the FileSystem API
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Share the file (this will open the native share dialog)
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        throw new Error('Sharing is not available on this platform');
      }
    }
  } catch (error) {
    console.error('Error downloading stream data:', error);
    throw error;
  }
};

/**
 * Gets file extension from MIME type
 */
const getFileExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExtension: { [key: string]: string } = {
    'text/plain': '.txt',
    'text/html': '.html',
    'text/css': '.css',
    'text/javascript': '.js',
    'application/json': '.json',
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'audio/mp3': '.mp3',
    'audio/wav': '.wav',
    'application/zip': '.zip',
    'application/x-zip-compressed': '.zip',
  };
  
  return mimeToExtension[mimeType] || '.bin';
};
