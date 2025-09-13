import { Platform } from "react-native";
import { NativeQRScanner } from "./NativeQRScanner";
import { WebQRScannerV2 } from "./WebQRScannerV2";


interface QrIoScannerProps {
  scanStatus: string;
  isActive: boolean;

  onQRCodeScanned: (b64Data: string) => void;
  onStatusChange?: (status: string) => void;
}

export const QrIoScanner = ({ 
  onQRCodeScanned,
  isActive,
  onStatusChange,
  scanStatus,
 }: QrIoScannerProps) => {

  const handleQRCodeScanned = (b64Data: string) => {
    onQRCodeScanned(b64Data);
  };

  // Web platform render
  if (Platform.OS === 'web') {
    return (
      <WebQRScannerV2
        onQRCodeScanned={handleQRCodeScanned}
        isActive={isActive}
        onStatusChange={onStatusChange}
        scanStatus={scanStatus}
      />
    );
  }
  
  // Native platform render
  return (
    <NativeQRScanner
      onQRCodeScanned={handleQRCodeScanned}
      isActive={isActive}
      onStatusChange={onStatusChange}
      // onReset={onReset}
      scanStatus={scanStatus}
      // onScanComplete={onScanComplete}
    />
  );
};
