import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { StreamScanView } from '../../../src/components/import-page/stream-scanner/StreamScanView';
import { useFocusEffect } from 'expo-router';

export const StreamScanner = () => {
  const [isScannerActive, setIsScannerActive] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsScannerActive(true);
      return () => {
        setIsScannerActive(false);
      };
    }, [])
  );

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StreamScanView
        isScannerActive={isScannerActive}
        onClose={handleClose}
      />
    </View>
  );
};

export default StreamScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
