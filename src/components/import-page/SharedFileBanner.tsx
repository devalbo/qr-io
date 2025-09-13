import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFileIntent } from '@/src/contexts/FileIntentContext';
import { formatFileSize, getFileIcon, validateSharedFile } from '@/src/utils/file-intent-utils';
import { useRouter } from 'expo-router';

export const SharedFileBanner = () => {
  const { sharedFile, clearSharedFile } = useFileIntent();
  const router = useRouter();

  if (!sharedFile) {
    return null;
  }

  const validation = validateSharedFile(sharedFile);

  const handleProcessFile = () => {
    if (!validation.isValid) {
      Alert.alert('Invalid File', validation.error || 'This file cannot be processed');
      return;
    }

    // Navigate to export page with the shared file
    router.push('/export');
  };

  const handleDismiss = () => {
    clearSharedFile();
  };

  return (
    <View style={[styles.container, validation.isValid ? styles.valid : styles.invalid]}>
      <View style={styles.content}>
        <View style={styles.fileInfo}>
          <Text style={styles.fileIcon}>{getFileIcon(sharedFile.mimeType)}</Text>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>
              {sharedFile.name}
            </Text>
            <Text style={styles.fileSize}>
              {formatFileSize(sharedFile.size)} • {sharedFile.mimeType}
            </Text>
            {!validation.isValid && (
              <Text style={styles.errorText}>
                {validation.error}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.actions}>
          {validation.isValid ? (
            <TouchableOpacity 
              style={styles.processButton} 
              onPress={handleProcessFile}
            >
              <Text style={styles.processButtonText}>Process</Text>
            </TouchableOpacity>
          ) : null}
          
          <TouchableOpacity 
            style={styles.dismissButton} 
            onPress={handleDismiss}
          >
            <Text style={styles.dismissButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  valid: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  invalid: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 12,
    color: '#f44336',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  processButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    padding: 8,
  },
  dismissButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
