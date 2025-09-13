import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QRScanner } from "../scanner/QRScanner";
import { convertBase64ToBinary } from "../../../utils/base64-utils";
import { QrDataFrame } from "@/protobufs/protofiles-out/qr-io";
import { ScannedCodeData } from "../scanned-code-data";
import { useCallback, useState } from "react";
import { addFrameToDatabase } from "@/src/utils/database-utils";
import { useQrIoTbStore } from "@/src/contexts/QrIoStorageContext";
import { LatestFrameAnalyzer } from "./LatestFrameAnalyzer";
import { useFocusEffect } from "expo-router";


interface FramesWatcherProps {
  cancelScanner: () => void;
}

export const FramesWatcher = ({
  cancelScanner,
}: FramesWatcherProps) => {

  const [lastScannedData, setLastScannedData] = useState<ScannedCodeData | null>(null);
  const [scannerStatus, setScannerStatus] = useState('Ready');

  const lastScannedDataFrame = lastScannedData?.qrDataFrame;

  const { store } = useQrIoTbStore();

  useFocusEffect(
    useCallback(() => {
      return () => {
        cancelScanner();
      };
    }, [])
  );

  const handleQRCodeScanned = async (scannedB64: string) => {
    console.log('ImportTab: QR code scanned, bytes length:', scannedB64.length);
    console.log('ImportTab: QR code scanned, bytes:', scannedB64);

    const data = convertBase64ToBinary(scannedB64);

    const frameData = QrDataFrame.fromBinary(data);
    console.log(frameData);

    const frameDataJson = QrDataFrame.toJsonString(frameData);

    const scannedData = {
      bytes: data,
      qrDataFrame: frameData,
      jsonContent: frameDataJson,
    } satisfies ScannedCodeData;

    setLastScannedData(scannedData);

    await addFrameToDatabase(store, frameData);
  };

  const handleScannerStatusChange = (status: string) => {
    setScannerStatus(status);
  };

  // if (frameContent) { 
  //   console.log("FRAME CONTENT", frameContent);
  // }

  // const latestFrameStreamId = getFrameStreamId(lastScannedDataFrame);


  return (
    <View style={styles.container}>
      <QRScanner
        onQRCodeScanned={handleQRCodeScanned}
        isActive={true}
        onStatusChange={handleScannerStatusChange}
      />
      <TouchableOpacity 
        style={styles.closeScannerButton} 
        onPress={cancelScanner}
      >
        <Text style={styles.closeScannerButtonText}>Close Scanner</Text>
      </TouchableOpacity>

      <LatestFrameAnalyzer
        latestFrame={lastScannedDataFrame}
        isVisible={true}
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
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
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  scannedCodesSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  scannedCodesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scannedCodesList: {
    maxHeight: 300,
    marginBottom: 12,
  },
  scannedCodeItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scannedCodeHeader: {
    marginBottom: 8,
  },
  scannedCodeType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  scannedCodeContent: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  scannedCodeError: {
    fontSize: 11,
    color: '#dc3545',
    fontStyle: 'italic',
  },
  jsonContentContainer: {
    maxHeight: 100,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  jsonContent: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  scannedCodeLength: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  scannedCodesButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  importButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  importButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
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
  lastScannedContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c3e6c3',
  },
  lastScannedLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d5a2d',
    marginBottom: 4,
  },
  lastScannedText: {
    fontSize: 12,
    color: '#2d5a2d',
    fontFamily: 'monospace',
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
  scannerInfoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  scannerJsonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 12,
    padding: 16,
    maxHeight: 300,
  },
  scannerJsonTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  scannerJsonContent: {
    maxHeight: 200,
  },
  scannerJsonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
