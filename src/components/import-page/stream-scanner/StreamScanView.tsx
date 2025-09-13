import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet
} from 'react-native';
import { QRScanner } from '../scanner/QRScanner';
import { convertBase64ToBinary } from '../../../utils/base64-utils';
import { QrDataFrame } from '@/protobufs/protofiles-out/qr-io';
import { ScannedCodeData } from '../scanned-code-data';
import { getFrameStreamId } from '@/src/utils/qrdata-utils';
import { addFrameToDatabase } from '@/src/utils/database-utils';
import { useQrIoTbStore } from '@/src/contexts/QrIoStorageContext';
import { AllFramesAssembler } from './AllFramesAssembler';
import { StreamProgressTracker } from './StreamProgressTracker';


interface StreamScanViewProps {
  onClose: () => void;
  isScannerActive: boolean;
}

export const StreamScanView = ({ onClose, isScannerActive }: StreamScanViewProps) => {
  const [lastScannedData, setLastScannedData] = useState<ScannedCodeData | null>(null);
  const [scannerStatus, setScannerStatus] = useState('Ready');

  // Reset progress data when scanner becomes active
  React.useEffect(() => {
    if (isScannerActive) {
      setLastScannedData(null);
      setScannerStatus('Ready');
    }
  }, [isScannerActive]);


  const handleQRCodeScanned = async (scannedB64: string) => {
    console.log('StreamScanView: QR code scanned, bytes length:', scannedB64.length);
    console.log('StreamScanView: QR code scanned, bytes:', scannedB64);

    try {
      const data = convertBase64ToBinary(scannedB64);
      const frameData = QrDataFrame.fromBinary(data);
      const frameDataJson = QrDataFrame.toJsonString(frameData);

      const scannedData: ScannedCodeData = {
        bytes: data,
        qrDataFrame: frameData,
        jsonContent: frameDataJson,
      };

      setLastScannedData(scannedData);
      await addFrameToDatabase(store, frameData);
    } catch (error) {
      console.error('StreamScanView: Error parsing QR code:', error);
    }
  };

  const handleScannerStatusChange = (status: string) => {
    setScannerStatus(status);
  };

  const closeScanner = () => {
    onClose();
  };

  const latestFrameStreamId = getFrameStreamId(lastScannedData?.qrDataFrame);
  const { queryApi, store } = useQrIoTbStore();

  // Get progress data for the current stream
  const numFramesRead = latestFrameStreamId ? queryApi.getNumFramesReadForStreamId(latestFrameStreamId) : 0;
  const expectedTotalFrameCount = latestFrameStreamId ? queryApi.getExpectedTotalFrameCountForStreamId(latestFrameStreamId) : null;
  
  // Get stream name if available - we'll need to access the store directly since there's no query API method
  const streamRecord = latestFrameStreamId ? store.getRow('contentStreams', latestFrameStreamId) : null;
  const streamName = streamRecord?.contentName as string | undefined;

  // Debug logging
  console.log('StreamScanView Debug:', {
    latestFrameStreamId,
    numFramesRead,
    expectedTotalFrameCount,
    streamName,
    isVisible: !!latestFrameStreamId
  });

  return (
    <View style={styles.container}>
      <QRScanner
        onQRCodeScanned={handleQRCodeScanned}
        isActive={isScannerActive}
        onStatusChange={handleScannerStatusChange}
      />
      <TouchableOpacity 
        style={styles.closeScannerButton} 
        onPress={closeScanner}
      >
        <Text style={styles.closeScannerButtonText}>Close Scanner</Text>
      </TouchableOpacity>

      {/* <AllFramesAssembler
        streamId={latestFrameStreamId}
        latestFrame={lastScannedData?.qrDataFrame}
      /> */}

      <StreamProgressTracker
        streamId={latestFrameStreamId}
        streamName={streamName}
        framesRead={numFramesRead}
        expectedFrames={expectedTotalFrameCount}
        expansionCorner="top-left"
        isVisible={isScannerActive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  scannerStatusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginRight: 8,
  },
  scannerStatusText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    flex: 1,
  },
  scannerInfoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  closeScannerButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  closeScannerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  streamDataSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streamDataTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  frameInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  frameInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  frameInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  frameInfoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  frameContentContainer: {
    marginBottom: 16,
  },
  frameContentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  frameContentScroll: {
    maxHeight: 150,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  frameContentText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  noDataSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  helpSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 32,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
});
