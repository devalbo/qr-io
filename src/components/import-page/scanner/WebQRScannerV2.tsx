import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Html5QrCodeScanner } from './Html5QrScanner';

const SCANNER_HTML_ELEMENT_ID = "qrio-scanner-container";

interface WebQRScannerProps {
  onQRCodeScanned: (b64Data: string) => void;
  isActive: boolean;
  onStatusChange?: (status: string) => void;
  scanStatus: string;
}

type CameraPermissionStatus = 'loading' | 'granted' | 'denied' | 'prompt';

export const WebQRScannerV2 = ({ 
  onQRCodeScanned, 
  isActive, 
  onStatusChange, 
  scanStatus 
}: WebQRScannerProps) => {

  const onQrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
    onQRCodeScanned(decodedText);
  };

  // const scannerRef = useRef<any>(null);
  // const containerRef = useRef<any>(null);
  // const [isInitialized, setIsInitialized] = useState(false);
  // const [isCleaningUp, setIsCleaningUp] = useState(false);
  // const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>('loading');

  // // Check camera permissions on mount
  // useEffect(() => {
  //   if (Platform.OS !== 'web') return;
  //   checkCameraPermissions();
  // }, []);

  // // Handle scanner lifecycle
  // useEffect(() => {
  //   if (Platform.OS !== 'web') return;

  //   if (isActive && !isCleaningUp && cameraPermission === 'granted') {
  //     const timer = setTimeout(() => {
  //       initializeScanner();
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   } else if (!isActive && scannerRef.current) {
  //     cleanupScanner();
  //   }

  //   return () => {
  //     if (scannerRef.current) {
  //       cleanupScanner();
  //     }
  //   };
  // }, [isActive, cameraPermission]);

  // const checkCameraPermissions = async () => {
  //   if (Platform.OS !== 'web') return;

  //   try {
  //     if (navigator.permissions) {
  //       const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
  //       if (permission.state === 'granted') {
  //         setCameraPermission('granted');
  //         onStatusChange?.('Camera permission granted');
  //       } else if (permission.state === 'denied') {
  //         setCameraPermission('denied');
  //         onStatusChange?.('Camera permission denied');
  //       } else {
  //         setCameraPermission('prompt');
  //         onStatusChange?.('Camera permission required');
  //       }
  //     } else {
  //       setCameraPermission('prompt');
  //       onStatusChange?.('Camera permission required');
  //     }
  //   } catch (error) {
  //     console.log('Permission check error:', error);
  //     setCameraPermission('prompt');
  //     onStatusChange?.('Camera permission required');
  //   }
  // };

  // const requestCameraPermission = async () => {
  //   if (Platform.OS !== 'web') return;

  //   try {
  //     setCameraPermission('loading');
  //     onStatusChange?.('Requesting camera permission...');

  //     const stream = await navigator.mediaDevices.getUserMedia({ 
  //       video: { 
  //         facingMode: 'environment'
  //       } 
  //     });
      
  //     // Stop the stream immediately - we just needed to check permission
  //     stream.getTracks().forEach(track => track.stop());
      
  //     setCameraPermission('granted');
  //     onStatusChange?.('Camera permission granted');
  //   } catch (error) {
  //     console.log('Camera permission error:', error);
  //     setCameraPermission('denied');
  //     onStatusChange?.('Camera permission denied');
  //   }
  // };

  // const initializeScanner = async () => {
  //   if (isCleaningUp || scannerRef.current) return;

  //   try {
  //     // Import html5-qrcode dynamically
  //     const html5Qrcode = await import('html5-qrcode');
  //     const Html5QrcodeScanner = html5Qrcode.Html5QrcodeScanner;

  //     const containerElement = getContainerElement();
  //     if (!containerElement) {
  //       onStatusChange?.('Container not found');
  //       return;
  //     }

  //     // Clear container safely
  //     try {
  //       containerElement.innerHTML = '';
  //     } catch (error) {
  //       console.log('Container clear error:', error);
  //     }

  //     // Create scanner div
  //     const scannerDiv = document.createElement('div');
  //     scannerDiv.id = SCANNER_HTML_ELEMENT_ID;
  //     scannerDiv.style.width = '100%';
  //     scannerDiv.style.height = '100%';
  //     containerElement.appendChild(scannerDiv);

  //     // Create scanner instance with configuration from documentation
  //     scannerRef.current = new Html5QrcodeScanner(
  //       SCANNER_HTML_ELEMENT_ID,
  //       { 
  //         fps: 10,                    // Frame per second for scanning
  //         qrbox: 250,                // Scanning region size
  //         aspectRatio: 1.0,          // 1:1 aspect ratio
  //         disableFlip: false,        // Allow scanning flipped QR codes
  //         showTorchButtonIfSupported: false,
  //         showZoomSliderIfSupported: false
  //       },
  //       false // verbose logging disabled
  //     );

  //     // Add custom CSS to hide unwanted UI elements
  //     // addCustomCSS();

  //     // Render scanner with success and error callbacks
  //     scannerRef.current.render(
  //       (decodedText: string, decodedResult: any) => {
  //         if (!isCleaningUp) {
  //           console.log(`Scan result: ${decodedText}`, decodedResult);
  //           onQRCodeScanned(decodedText);
  //           // Optionally stop scanning after successful scan
  //           // scannerRef.current.clear();
  //         }
  //       },
  //       (error: any) => {
  //         // Only log errors that aren't related to cleanup
  //         if (!isCleaningUp && !error.toString().includes('stop')) {
  //           console.log('Scanner error:', error);
  //         }
  //       }
  //     );

  //     setIsInitialized(true);
  //     onStatusChange?.('Scanner ready');
  //   } catch (error) {
  //     console.error('Failed to initialize scanner:', error);
  //     onStatusChange?.('Failed to initialize camera');
  //   }
  // };

  // const cleanupScanner = () => {
  //   if (isCleaningUp) return;
    
  //   setIsCleaningUp(true);
  //   setIsInitialized(false);

  //   if (scannerRef.current) {
  //     try {
  //       // Stop scanner first
  //       if (typeof scannerRef.current.stop === 'function') {
  //         scannerRef.current.stop().catch((error: any) => {
  //           console.log('Scanner stop error:', error);
  //         });
  //       }
  //     } catch (error) {
  //       console.log('Error stopping scanner:', error);
  //     }

  //     try {
  //       // Clear scanner
  //       if (typeof scannerRef.current.clear === 'function') {
  //         scannerRef.current.clear();
  //       }
  //     } catch (error) {
  //       console.log('Error clearing scanner:', error);
  //     }

  //     scannerRef.current = null;
  //   }

  //   // Reset cleanup flag after a delay
  //   setTimeout(() => {
  //     setIsCleaningUp(false);
  //   }, 200);
  // };

  // const getContainerElement = () => {
  //   let containerElement = document.getElementById(SCANNER_HTML_ELEMENT_ID);
  //   if (!containerElement && containerRef.current) {
  //     containerElement = containerRef.current._nativeTag ? 
  //       document.querySelector(`[data-native-tag="${containerRef.current._nativeTag}"]`) :
  //       containerRef.current;
  //   }
  //   return containerElement;
  // };

  // // const addCustomCSS = () => {
  // //   try {
  // //     const style = document.createElement('style');
  // //     style.textContent = `
  // //       /* Hide unwanted UI elements from html5-qrcode */
  // //       #html5-qrcode-button-camera-stop,
  // //       #html5-qrcode-select-camera,
  // //       #html5-qrcode-button-file-selection,
  // //       #html5-qrcode__dashboard_section_csr,
  // //       #html5-qrcode__dashboard_section_header,
  // //       #${SCANNER_HTML_ELEMENT_ID}__dashboard {
  // //         display: none !important;
  // //         visibility: hidden !important;
  // //       }
        
  // //       /* Ensure scanner takes full container space */
  // //       #${SCANNER_HTML_ELEMENT_ID},
  // //       #${SCANNER_HTML_ELEMENT_ID}__camera {
  // //         width: 100% !important;
  // //         height: 100% !important;
  // //       }
        
  // //       /* Style the scanning region */
  // //       #${SCANNER_HTML_ELEMENT_ID}__camera {
  // //         border-radius: 8px;
  // //       }
  // //     `;
  // //     document.head.appendChild(style);
  // //   } catch (error) {
  // //     console.log('CSS addition error:', error);
  // //   }
  // // };

  // // Handle different permission states
  // if (cameraPermission === 'loading') {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <Text style={styles.fallbackText}>Checking camera permissions...</Text>
  //         <Text style={styles.statusText}>{scanStatus}</Text>
  //       </View>
  //     </View>
  //   );
  // }

  // if (cameraPermission === 'denied') {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.permissionContainer}>
  //         <Text style={styles.permissionText}>Camera permission denied</Text>
  //         <Text style={styles.permissionSubtext}>
  //           Camera access is required to scan QR codes. Please enable camera permissions in your browser settings.
  //         </Text>
  //         <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
  //           <Text style={styles.permissionButtonText}>Try Again</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }

  // if (cameraPermission === 'prompt') {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.permissionContainer}>
  //         <Text style={styles.permissionText}>Camera permission required</Text>
  //         <Text style={styles.permissionSubtext}>
  //           This app needs access to your camera to scan QR codes.
  //         </Text>
  //         <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
  //           <Text style={styles.permissionButtonText}>Grant Permission</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }

  // if (!isActive) {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.inactiveContainer}>
  //         <Text style={styles.inactiveText}>Scanner inactive</Text>
  //         <Text style={styles.inactiveSubtext}>
  //           Tap the "Start Scanning" button to begin
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <Html5QrCodeScanner
        fps={10}
        // qrbox={250}
        aspectRatio={1.0}
        disableFlip={false}
        verbose={false}
        onQrCodeSuccessCallback={onQrCodeSuccessCallback}
      />
      {/* <View 
        style={styles.scannerContainer}
        ref={containerRef}
        nativeID={SCANNER_HTML_ELEMENT_ID}
      >
        {!isInitialized && (
          <View style={styles.loadingContainer}>
            <Text style={styles.fallbackText}>
              {isCleaningUp ? 'Stopping scanner...' : 'Camera scanner loading...'}
            </Text>
            <Text style={styles.statusText}>
              {scanStatus}
            </Text>
          </View>
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
    minHeight: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inactiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  statusText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inactiveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  inactiveSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});
