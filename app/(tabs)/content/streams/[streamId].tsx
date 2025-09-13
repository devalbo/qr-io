import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useQrIoTbStore } from '@/src/contexts/QrIoStorageContext';
import { StreamPage } from '@/src/components/content-page/StreamPage';
import { TxStreamIdSchema } from '@/src/types/database';

export default function StreamDetailsPage() {
  const { streamId } = useLocalSearchParams<{ streamId: string }>();
  const { queryApi } = useQrIoTbStore();

  const txStreamId = TxStreamIdSchema.safeParse(streamId);
  if (!txStreamId.success) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid stream ID</Text>
      </View>
    );
  }

  const stream = queryApi.getStreamById(txStreamId.data);

  if (!stream) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Stream not found</Text>
      </View>
    );
  }

  return <StreamPage stream={stream} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
