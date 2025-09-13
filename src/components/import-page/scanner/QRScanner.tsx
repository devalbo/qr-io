import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { QrIoScanner } from './QrIoScanner';


interface QRScannerProps {
  onQRCodeScanned: (b64Data: string) => void;
  isActive: boolean;
  onStatusChange?: (status: string) => void;
}

export const QRScanner = ({
  onQRCodeScanned,
  isActive,
  onStatusChange,
 }: QRScannerProps) => {

  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanStatus, setScanStatus] = useState('Ready to scan');

  // useEffect(() => {
  //   // For web, let WebQRScanner handle its own camera permissions
  //   // For native, assume permission is granted (handled by NativeQRScanner)
  //   if (Platform.OS === 'web') {
  //     setHasPermission(true);
  //     setScanStatus('Ready to scan');
  //   } else {
  //     setHasPermission(true);
  //     setScanStatus('Camera ready');
  //   }
  // }, []);

  const handleBarCodeScanned = (b64Data: string) => {
    onQRCodeScanned(b64Data);
  };

  // const resetScanner = () => {
  //   setScanStatus('Scanner reset - ready to scan');
  //   onStatusChange?.('Scanner reset - ready to scan');
  // };

  // Show loading state while checking permissions
  // if (hasPermission === null) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" color="#007AFF" />
  //       <Text style={styles.permissionText}>{scanStatus}</Text>
  //     </View>
  //   );
  // }


  // Show inactive state
  if (!isActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.inactiveText}>{scanStatus}</Text>
        <Text style={styles.inactiveSubtext}>
          Tap the "Start Scanning" button to begin
        </Text>
      </View>
    );
  }
  

  return (
    <View style={styles.container}> 
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Debug: Active={isActive ? 'Yes' : 'No'} | Platform=Web
        </Text>
      </View>

      <QrIoScanner
        onQRCodeScanned={handleBarCodeScanned}
        isActive={isActive}
        onStatusChange={onStatusChange}
        scanStatus={scanStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
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
});
