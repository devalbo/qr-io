import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { FrameScanView } from '@/src/components/import-page/FrameScanView';

export const FrameInspector = () => {
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
      <FrameScanView
        onClose={handleClose}
        isScannerActive={isScannerActive}
      />
    </View>
  );
};

export default FrameInspector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});
