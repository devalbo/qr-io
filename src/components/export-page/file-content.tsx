import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ContentTypeAndData } from "../qr-io-frames-types";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from "react-native";
import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { generateQrIoBytesContentHash } from "@/src/utils/qrCodeUtils";
import { ContentHash } from "@/src/types/database";


interface FileContentProps {
  content: ContentTypeAndData | null;
  handleBytesChange: (contentName: string, contentMimeType: string, bytes: Uint8Array) => void;
  selectedFile: DocumentPicker.DocumentPickerResult | null;
  onSelectedFileChange: (file: DocumentPicker.DocumentPickerResult | null) => void;
}

export const FileContent = ({ content, handleBytesChange, selectedFile, onSelectedFileChange }: FileContentProps) => {

  const [fileBytesHash, setFileBytesHash] = useState<ContentHash | null>(null);

  const fileBytes = content?.content.oneofKind === 'bytesContent' 
    ? content.content.bytesContent 
    : new Uint8Array();

  useEffect(() => {
    generateQrIoBytesContentHash(fileBytes)
      .then(result => {
        setFileBytesHash(result);
      })
      .catch(error => {
        console.error(error);
      });
  }, [fileBytes]);


  
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onSelectedFileChange(result);
        
        // Read file bytes - handle web platform differently
        if (file.uri) {
          let fileBytes: Uint8Array;
          
          if (Platform.OS === 'web' && file.file) {
            // Web platform: use File API
            const arrayBuffer = await file.file.arrayBuffer();
            fileBytes = new Uint8Array(arrayBuffer);

            console.log('handleFilePick: File bytes count:', fileBytes.length);

          } else {
            // Native platforms: use modern File API to read binary data directly
            const fsFile = new FileSystem.File(file.uri);
            fileBytes = fsFile.bytesSync();
          }
          
          const fileMimeType = file.mimeType || 'application/octet-stream';
          
          handleBytesChange(file.name, fileMimeType, fileBytes);
        }
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  return (
    <View style={styles.inputSection}>
      <TouchableOpacity style={styles.filePickerButton} onPress={handleFilePick}>
        <Text style={styles.filePickerButtonText}>
          {selectedFile && !selectedFile.canceled ? '📁 Change File' : '📁 Select File'}
        </Text>
      </TouchableOpacity>

      {selectedFile && !selectedFile.canceled && selectedFile.assets && selectedFile.assets.length > 0 ? (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{selectedFile.assets[0].name}</Text>
          <Text style={styles.fileSize}>
            {fileBytes ? `${Math.round(fileBytes.length / 1024)} KB` : 
              selectedFile.assets[0].size ? `${Math.round(selectedFile.assets[0].size / 1024)} KB` : 'Loading...'}
          </Text>
          {fileBytes ? (
            <View>
              <Text style={styles.dataSourceIndicator}>✓ File data ready ({fileBytes.length} bytes)</Text>
              <Text style={styles.dataSourceIndicator}>✓ File data hash: {fileBytesHash?.contentHashB64}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      </View>
  );
};

const styles = StyleSheet.create({
  inputSection: {
    marginBottom: 20,
  },
  filePickerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  filePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dataSourceIndicator: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 8,
  },
});
