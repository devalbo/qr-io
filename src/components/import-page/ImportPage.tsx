import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { LoadingSpinner } from '../LoadingSpinner';
import { GenericTabControl } from '../GenericTabControl';
import { ImportStreamSection } from './import-stream-section';
import { InspectFramesSection } from './inspect-frames-section';
import { SharedFileBanner } from './SharedFileBanner';

type ScannerMode = 'stream' | 'frame';

interface TabOption {
  value: ScannerMode;
  label: string;
  icon: string;
}

const scannerTabs: TabOption[] = [
  { value: 'stream', label: 'Stream Scan', icon: '📡' },
  { value: 'frame', label: 'Frame Inspector', icon: '📱' },
];

export const ImportPage = () => {
  const { isLoading, settings } = useApp();
  const [activeMode, setActiveMode] = useState<ScannerMode>('stream');

  if (isLoading) {
    return <LoadingSpinner message="Importing data..." />;
  }

  // Filter tabs based on debug mode
  const availableTabs = scannerTabs.filter(tab => 
    tab.value === 'stream' || (tab.value === 'frame' && settings.debugMode)
  );

  // Ensure activeMode is valid when debug mode changes
  useEffect(() => {
    if (!settings.debugMode && activeMode === 'frame') {
      setActiveMode('stream');
    }
  }, [settings.debugMode, activeMode]);

  const handleModeChange = (mode: ScannerMode) => {
    setActiveMode(mode);
  };

  const handleStreamScanner = () => {
    router.push('/import/stream-scanner');
  };

  const handleFrameInspector = () => {
    router.push('/import/frame-inspector');
  };

  return (
    <ScrollView style={styles.container}>
      <SharedFileBanner />
      
      <View style={styles.header}>
        <Text style={styles.title}>Import Data</Text>
        <Text style={styles.subtitle}>
          Choose how you want to import QR code data into your device
        </Text>
        
        {availableTabs.length > 1 && (
          <GenericTabControl
            options={availableTabs}
            selectedValue={activeMode}
            onValueChange={handleModeChange}
          />
        )}
      </View>

      <View style={styles.ioSection}>
        {activeMode === 'stream' ? (
          <ImportStreamSection
            handleStreamScanner={handleStreamScanner}
          />
          /* Stream Scan Section */
          // <View style={styles.section}>
          //   <Text style={styles.sectionTitle}>📡 Stream Scan</Text>
          //   <Text style={styles.sectionDescription}>
          //     Scan multiple QR code frames to build complete data streams. Frames are automatically assembled and stored.
          //   </Text>
          //   <TouchableOpacity 
          //     style={styles.button} 
          //     onPress={handleStreamScanner}
          //   >
          //     <Text style={styles.buttonText}>
          //       Start Stream Scanner
          //     </Text>
          //   </TouchableOpacity>
          //   <Text style={styles.scannerInfoText}>
          //     Scan multiple QR code frames in sequence to build complete data streams
          //   </Text>
          // </View>
        ) : (
          <InspectFramesSection
            handleFrameInspector={handleFrameInspector}
          />
          /* Frame Scan Section */
          // <View style={styles.section}>
          //   <Text style={styles.sectionTitle}>📱 Frame Scan</Text>
          //   <Text style={styles.sectionDescription}>
          //     Scan individual QR code frames and view their data immediately. Perfect for testing and debugging.
          //   </Text>
            
          //   <TouchableOpacity 
          //     style={styles.button} 
          //     onPress={handleFrameInspector}
          //   >
          //     <Text style={styles.buttonText}>
          //       Open Frame Inspector
          //     </Text>
          //   </TouchableOpacity>
            
          //   <Text style={styles.scannerInfoText}>
          //     Scan individual QR code frames and view their data immediately
          //   </Text>
          // </View>
        )}
      </View>
    </ScrollView>
  );
};

ImportPage.displayName = 'ImportTab';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  ioSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerInfoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
