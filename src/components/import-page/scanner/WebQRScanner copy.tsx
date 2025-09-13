// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';


// interface WebQRScannerProps {
//   isActive: boolean;
//   onQRCodeScanned: (b64Data: string) => void;

//   scanStatus: string;
//   onStatusChange?: (status: string) => void;
// }

// export const WebQRScanner = ({ 
//   isActive, 
//   onQRCodeScanned, 
//   scanStatus,
//   onStatusChange, 
// }: WebQRScannerProps) => {

//   const webScannerRef = useRef<any>(null);
//   const containerRef = useRef<any>(null);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const isCleaningUpRef = useRef(false);

//   useEffect(() => {    
//     if (isActive && !webScannerRef.current) {
//       initializeWebScanner()
//         .catch(error => {
//           console.error('Failed to initialize web scanner:', error);
//         });
//     } else if (!isActive && webScannerRef.current) {
//       cleanupWebScanner();
//     }

//     // Cleanup on unmount
//     return () => {
//       cleanupWebScanner();
//     };
//   }, [isActive]);

//   const initializeWebScanner = async () => {
//     console.log('WebQRScanner: Initializing scanner...');
    
//     // Don't initialize if we're cleaning up
//     if (isCleaningUpRef.current) {
//       console.log('WebQRScanner: Skipping initialization during cleanup');
//       return;
//     }
    
//     // Reset cleanup flag
//     isCleaningUpRef.current = false;
    
//     try {
//       // Dynamically import html5-qrcode only on web
//       const html5Qrcode = await import('html5-qrcode');
//       const Html5QrcodeScanner = html5Qrcode.Html5QrcodeScanner;
      
//       // Wait for DOM to be ready
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Check if we're still supposed to be initializing
//       if (isCleaningUpRef.current) {
//         return;
//       }
      
//       // Find the container element
//       let containerElement = document.getElementById('qrio-scanner-container');
//       if (!containerElement && containerRef.current) {
//         containerElement = containerRef.current._nativeTag ? 
//           document.querySelector(`[data-native-tag="${containerRef.current._nativeTag}"]`) :
//           containerRef.current;
//       }
      
//       if (!containerElement) {
//         onStatusChange?.('Failed to find container element');
//         return;
//       }
      
//       // Clear and setup container normally
//       containerElement.innerHTML = '';
//       const scannerDiv = document.createElement('div');
//       scannerDiv.id = 'qr-reader';
//       scannerDiv.style.width = '100%';
//       scannerDiv.style.height = '100%';
//       containerElement.appendChild(scannerDiv);
      
//       // Initialize scanner
//       setTimeout(() => {
//         if (isCleaningUpRef.current) return;
        
//         try {
//           webScannerRef.current = new Html5QrcodeScanner(
//             "qr-reader",
//             { 
//               fps: 10,
//               aspectRatio: 1.0
//             },
//             false
//           );
          
//           addCustomCSS();
          
//           webScannerRef.current.render((decodedText: string) => {
//             if (isCleaningUpRef.current) return;
//             onQRCodeScanned(decodedText);
//           }, (error: any) => {
//             if (isCleaningUpRef.current) return;
//             console.log('Web QR Scanner error:', error);
//           });
          
//           setIsInitialized(true);
//           onStatusChange?.('Scanner initialized');
//         } catch (error) {
//           console.error('Failed to create scanner:', error);
//           onStatusChange?.('Failed to initialize camera');
//         }
//       }, 2000);
//     } catch (error) {
//       console.error('Failed to initialize web scanner:', error);
//       onStatusChange?.('Failed to initialize camera');
//     }
//   };

//   const addCustomCSS = () => {
//     // Create a style element to hide unwanted html5-qrcode UI elements
//     const style = document.createElement('style');
//     style.textContent = `
//       /* Hide the stop scanning button */
//       #html5-qrcode-button-camera-stop {
//         display: none !important;
//         visibility: hidden !important;
//       }
      
//       /* Hide the camera selection dropdown */
//       #html5-qrcode-select-camera {
//         display: none !important;
//         visibility: hidden !important;
//       }
      
//       /* Hide the file input button */
//       #html5-qrcode-button-file-selection {
//         display: none !important;
//         visibility: hidden !important;
//       }
      
//       /* Hide the scanner info text */
//       #html5-qrcode__dashboard_section_csr {
//         display: none !important;
//         visibility: hidden !important;
//       }
      
//       /* Hide the scanner header */
//       #html5-qrcode__dashboard_section_header {
//         display: none !important;
//         visibility: hidden !important;
//       }
      
//       /* Make the scanner area take full space */
//       #qr-reader {
//         width: 100% !important;
//         height: 100% !important;
//       }
      
//       /* Hide the scanner dashboard wrapper */
//       #qr-reader__dashboard {
//         display: none !important;
//         visibility: hidden !important;
//       }
      
//       /* Make the scanner video take full space */
//       #qr-reader__camera {
//         width: 100% !important;
//         height: 100% !important;
//       }
//     `;
    
//     // Add the style to the document head
//     document.head.appendChild(style);
//     console.log('WebQRScanner: Added custom CSS to hide UI elements');
//   };

//   const cleanupWebScanner = () => {
//     isCleaningUpRef.current = true;
//     setIsInitialized(false);
    
//     if (webScannerRef.current) {
//       try {
//         webScannerRef.current.stop();
//         webScannerRef.current.clear();
//       } catch (error) {
//         console.log('Error stopping scanner:', error);
//       }
//       webScannerRef.current = null;
//     }
    
//     // Clear container normally
//     try {
//       let containerElement = document.getElementById('qrio-scanner-container');
//       if (!containerElement && containerRef.current) {
//         containerElement = containerRef.current._nativeTag ? 
//           document.querySelector(`[data-native-tag="${containerRef.current._nativeTag}"]`) :
//           containerRef.current;
//       }
      
//       if (containerElement) {
//         containerElement.innerHTML = '';
//       }
      
//       // Remove custom CSS
//       const customStyles = document.querySelectorAll('style');
//       customStyles.forEach(style => {
//         if (style.textContent && style.textContent.includes('html5-qrcode-button-camera-stop')) {
//           style.remove();
//         }
//       });
//     } catch (error) {
//       console.error('Error cleaning up:', error);
//     }
//   };

//   // If not on web platform, show a message
//   if (Platform.OS !== 'web') {
//     return (
//       <View style={styles.container}>
//         <View style={styles.scannerContainer}>
//           <Text style={styles.fallbackText}>
//             Web QR Scanner is only available on web platform
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View 
//         style={styles.scannerContainer}
//         ref={containerRef}
//         // Add a native ID for easier DOM access
//         nativeID="qrio-scanner-container"
//       >
//         {/* Fallback content if scanner doesn't load */}
//         {!isInitialized && (
//           <View style={styles.loadingContainer}>
//             <Text style={styles.fallbackText}>
//               Camera scanner loading...
//             </Text>
//             <Text style={styles.statusText}>
//               {scanStatus}
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   scannerContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//     minHeight: 400, // Ensure minimum height for scanner
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   resetButton: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   resetButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   counterText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   debugContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 10,
//     zIndex: 10,
//   },
//   debugText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   fallbackText: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   statusText: {
//     color: '#ccc',
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });
