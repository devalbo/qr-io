import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { QrDataFrame } from '@/protobufs/protofiles-out/qr-io';

interface NativeQRScannerProps {
  onQRCodeScanned: (b64Data: string) => void;
  isActive: boolean;
  // scannedCodes: string[];
  onStatusChange?: (status: string) => void;
  // onReset: () => void;
  scanStatus: string;
  // onScanComplete?: (data: Uint8Array) => void; // New callback for when scanning is complete
}

export const NativeQRScanner = ({ 
  onQRCodeScanned, 
  isActive,
  // scannedCodes, 
  onStatusChange, 
  // onReset, 
  scanStatus,
  // onScanComplete 
}: NativeQRScannerProps) => {
  // const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission?.granted) {
      onStatusChange?.('Camera ready');
    } else if (permission?.status === 'denied') {
      onStatusChange?.('Camera permission denied');
    } else if (permission?.status === 'undetermined') {
      onStatusChange?.('Requesting camera permission...');
    }
  }, [permission, onStatusChange]);

  useEffect(() => {
    if (isActive && permission?.granted) {
      setIsScanning(true);
      // setScanned(false);
      onStatusChange?.('Scanning for QR codes...');
      console.log('Native QR Scanner: Starting scan, permission granted');
    } else {
      setIsScanning(false);
      // setScanned(false);
      onStatusChange?.('Scanner inactive');
      console.log('Native QR Scanner: Stopping scan, active:', isActive, 'permission:', permission?.granted);
    }
  }, [isActive, permission?.granted, onStatusChange]);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    const { data, raw } = scanningResult;

    // console.log(`Native QR Scanner: Bar code scanned: ${type}, ${data}, ${raw}`);
    console.log(`Native QR Scanner: Bar code scanned data [${data.length}]: ${data}`);
    console.log(`Native QR Scanner: Bar code scanned raw [${raw?.length}]: ${raw}`);

    // const scannedBytes = new TextEncoder().encode(data);
    // console.log(`scannedbytes [${scannedBytes.length}]: ${scannedBytes}`);

    // const x = QrDataFrame.fromBinary(scannedBytes);
    // console.log('x', x);

    // const { type, data } = scanResult;
    // console.log(`Native QR Scanner: Bar code scanned encoded: ${scannedBytes.length} bytes`);
    if (isScanning && data) {
      // setScanned(true);
      
      // // Check if this QR code has already been scanned
      // if (scannedCodes.includes(data)) {
      //   onStatusChange?.('Duplicate QR code detected');
      //   Alert.alert('Duplicate QR Code', 'This QR code has already been scanned.');
      //   // Reset after a short delay to allow scanning again
      //   setTimeout(() => {
      //     if (isScanning) {
      //       setScanned(false);
      //       onStatusChange?.('Scanning for QR codes...');
      //     }
      //   }, 2000);
      //   return;
      // }

      // Call the callback with the scanned data
      // onStatusChange?.(`QR code detected: ${scannedBytes && scannedBytes.length > 30 ? scannedBytes.substring(0, 30) + '...' : scannedBytes}`);
      // onStatusChange?.(`QR code detected: ${scannedBytes.length} bytes`);
      onQRCodeScanned(data);
      
      // Call the scan complete callback to close the scanner
      // onScanComplete?.(scannedBytes);
      
      // Reset after a short delay to allow scanning again
      // setTimeout(() => {
      //   if (isScanning) {
      //     setScanned(false);
      //     onStatusChange?.('Scanning for QR codes...');
      //   }
      // }, 1500);
    }
  };

  // const resetScanner = () => {
  //   setScanned(false);
  //   onStatusChange?.('Scanner reset - ready to scan');
  // };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission denied</Text>
        <Text style={styles.permissionSubtext}>
          Camera permission is required to scan QR codes
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.inactiveText}>Scanner inactive</Text>
        <Text style={styles.inactiveSubtext}>
          Tap the "Start Scanning" button to begin
        </Text>
      </View>
    );
  }

  // console.log('Native QR Scanner: Rendering main view, permission:', permission?.granted, 'isActive:', isActive, 'isScanning:', isScanning);
  
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <Text>Scanner Status: {scanStatus}</Text>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const scanAreaSize = Math.min(width, height) * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#007AFF',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: undefined,
    borderLeftWidth: 0,
    borderRightWidth: 4,
  },
  bottomLeft: {
    top: undefined,
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: 4,
  },
  bottomRight: {
    top: undefined,
    bottom: 0,
    right: 0,
    left: undefined,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scannedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  counterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inactiveText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  inactiveSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    zIndex: 10,
  },
  debugText: {
    color: '#fff',
    fontSize: 14,
  },
});
