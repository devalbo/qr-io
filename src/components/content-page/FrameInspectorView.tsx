import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { ContentAcquisitionStreamRecord, ContentAcquisitionFrameRecord } from '@/src/types/database';
import { SingleFrameDetailsView } from './SingleFrameDetailsView';
import { TabControl } from '@/src/components/TabControl';
import { ContentFormatType, CONTENT_FORMAT_OPTIONS } from '@/src/types/content-format';


interface FrameInspectorViewProps {
  onClose: () => void;
  stream: ContentAcquisitionStreamRecord;
  frames: ContentAcquisitionFrameRecord[] | null;
}

export const FrameInspectorView = ({ onClose, stream, frames }: FrameInspectorViewProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ContentFormatType>('hash');

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Frame Inspector</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.streamInfo}>
            Stream: {stream.contentName} ({frames?.length || 0} frames)
          </Text>
          <Text style={styles.streamInfo}>
            Stream ID: {stream.txStreamId}
          </Text>

          <TabControl
            options={CONTENT_FORMAT_OPTIONS}
            selectedValue={selectedFormat}
            onValueChange={setSelectedFormat}
          />
          
          <ScrollView style={styles.framesContainer}>
            {frames && frames.length > 0 ? (
              frames.map((frame, index) => (
                <SingleFrameDetailsView
                  key={`${frame.txStreamId}-${frame.contentIndex}-${index}`}
                  frame={frame}
                  index={index}
                  contentFormat={selectedFormat}
                />
              ))
            ) : (
              <View style={styles.noFramesContainer}>
                <Text style={styles.noFramesText}>No frames available for this stream.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  streamInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
  },
  framesContainer: {
    flex: 1,
  },
  frameItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  frameIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noFramesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  noFramesText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
