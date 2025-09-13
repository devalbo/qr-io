import { ContentAcquisitionStreamRecord } from "@/src/types/database";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


interface StreamSummaryItemProps {
  stream: ContentAcquisitionStreamRecord;
  handleStreamPress: (stream: ContentAcquisitionStreamRecord) => void;
  handleDeleteStream: (stream: ContentAcquisitionStreamRecord) => void;
  handleDownloadStream: (stream: ContentAcquisitionStreamRecord) => void;
}

export const StreamSummaryItem = ({ stream, handleStreamPress, handleDeleteStream, handleDownloadStream }: StreamSummaryItemProps) => {
  return (
    <TouchableOpacity
      key={stream.txStreamId}
      style={styles.streamItem}
      onPress={() => handleStreamPress(stream)}
    >
      <View style={styles.streamContent}>
        <Text style={styles.streamName}>{stream.contentName}</Text>
        <Text style={styles.streamId}>ID: {stream.txStreamId}</Text>
        <Text style={styles.streamDetails}>
          Frames: {stream.totalFrameCount} | Created: {new Date(stream.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDownloadStream(stream);
          }}
        >
          <Text style={styles.downloadIcon}>⬇️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteStream(stream);
          }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  streamItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  streamContent: {
    flex: 1,
  },
  streamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  streamId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  streamDetails: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  downloadIcon: {
    fontSize: 18,
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 18,
    color: '#fff',
  },
});
