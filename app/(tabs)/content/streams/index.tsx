import React from 'react';
import { useQrIoTbStore } from '../../../../src/contexts/QrIoStorageContext';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ContentAcquisitionStreamRecord } from '../../../../src/types/database';
import { StreamSummaryItem } from '@/src/components/content-page/stream-components/StreamSummaryItem';
import { useApp } from '@/src/contexts/AppContext';


export const ContentStreamsPage = () => {
  const { data } = useQrIoTbStore();
  const { queryApi } = useQrIoTbStore();
  const { backendApi } = useApp();

  const { allStreams } = data;
  const router = useRouter();

  const handleStreamPress = (stream: ContentAcquisitionStreamRecord) => {
    router.push(`/content/streams/${stream.txStreamId}`);
  };

  const handleDeleteStream = (stream: ContentAcquisitionStreamRecord) => {
    console.log('handleDeleteStream: ', stream);
    backendApi.deleteStream(queryApi, stream.txStreamId);
  };

  const handleDownloadStream = (stream: ContentAcquisitionStreamRecord) => {
    console.log('handleDownloadStream: ', stream);
    backendApi.downloadStream(queryApi, stream.txStreamId);
  };

  if (allStreams.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No streams found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {allStreams.map((stream) => (
        <StreamSummaryItem
          key={stream.txStreamId}
          stream={stream}
          handleStreamPress={handleStreamPress}
          handleDeleteStream={handleDeleteStream}
          handleDownloadStream={handleDownloadStream}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  streamItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
});

export default ContentStreamsPage;
