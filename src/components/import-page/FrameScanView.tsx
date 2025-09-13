import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Alert
} from 'react-native';
import { QRScanner } from './scanner/QRScanner';
import { convertBase64ToBinary } from '../../utils/base64-utils';
import { QrDataFrame } from '@/protobufs/protofiles-out/qr-io';
import { ScannedCodeData } from './scanned-code-data';
import { LatestFrameAnalyzer } from './frame-inspector/LatestFrameAnalyzer';


interface FrameScanViewProps {
  isScannerActive: boolean;
  onClose: () => void;
}

export const FrameScanView = ({ onClose, isScannerActive }: FrameScanViewProps) => {
  const [lastScannedData, setLastScannedData] = useState<ScannedCodeData | null>(null);
  const [scannerStatus, setScannerStatus] = useState('Ready');
  
  const handleQRCodeScanned = (scannedB64: string) => {
    console.log('FrameScanView: QR code scanned, bytes length:', scannedB64.length);

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
      
    } catch (error) {
      console.error('FrameScanView: Error parsing QR code:', error);
      Alert.alert(
        'Scan Error',
        'Failed to parse the scanned QR code as a valid frame.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleScannerStatusChange = (status: string) => {
    setScannerStatus(status);
  };

  const closeScanner = () => {
    onClose();
  };

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

      <LatestFrameAnalyzer
        latestFrame={lastScannedData?.qrDataFrame}
      />
{/*       
      <View style={styles.scannerHelpContainer}>
        <Text style={styles.scannerHelpText}>
          Point your camera at a QR code frame to scan
        </Text>
        <Text style={styles.scannerHelpSubtext}>
          The scanner will close automatically after scanning
        </Text>
      </View> */}
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
  scannerHelpContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scannerHelpText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  scannerHelpSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  frameDataSection: {
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
  frameDataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  frameDataTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  jsonContainer: {
    marginBottom: 16,
  },
  jsonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  jsonScroll: {
    maxHeight: 200,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  jsonText: {
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
});
