import { QrDataFrame } from '@/protobufs/protofiles-out/qr-io';
import { StyleSheet, View, Text } from 'react-native';
import { QRCodeDisplay } from './QRCodeDisplay';
import { encodeFrameForQR } from '../utils/qrCodeUtils';
import { FrameContentPlaybackControls } from './export-page/FrameContentPlaybackControls';


interface QrIoFramesDisplayProps {
  frames: QrDataFrame[];
  activeFrameIndex: number;
  framesPerSecond: number;
  maxBytesPerQrCode: number;
  onPreviousFrame: () => void;
  onNextFrame: () => void;

  isAutoplaying: boolean;
  startAutoplay: () => void;
  stopAutoplay: () => void;
}

export const QrIoFramesDisplay = ({ 
  frames,
  activeFrameIndex,
  framesPerSecond,
  maxBytesPerQrCode,
  onPreviousFrame,
  onNextFrame,
  isAutoplaying,
  startAutoplay,
  stopAutoplay,
}: QrIoFramesDisplayProps) => {

  if (frames.length === 0) {
    return (
      <View style={styles.noDataMessage}>
        <Text style={styles.noDataText}>No frames available</Text>
      </View>
    );
  }
  
  const activeFrame = frames[activeFrameIndex];

  // console.log('xframes', frames);
  // console.log('activeFrame', activeFrame);

  const qrCodeData = encodeFrameForQR(activeFrame);
  

  return (
    <View style={styles.inputSection}>
      {frames ? (
        <>
          <FrameContentPlaybackControls
            frames={frames}
            currentFrameIndex={activeFrameIndex}
            framesPerSecond={framesPerSecond}
            onPreviousFrame={onPreviousFrame}
            onNextFrame={onNextFrame}
            isAutoplaying={isAutoplaying}
            startAutoplay={startAutoplay}
            stopAutoplay={stopAutoplay}
          />
          
          <View style={styles.qrCodeWrapper}>
            <QRCodeDisplay
              data={qrCodeData}
              title={`QR Code Export`}
              // showInfo={true}
              maxBytesPerQrCode={maxBytesPerQrCode}
              onError={(error: any) => console.error('QR Code error:', error)}
            />
          </View>
        </>
      ) : (
        <View style={styles.noDataMessage}>
          <Text style={styles.noDataText}>No data available for QR code generation</Text>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  inputSection: {
    marginTop: 20,
  },
  noDataMessage: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  frameCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  frameCounter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sideNavButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  sideNavButtonText: {
    color: 'white',
    fontSize: 18,
  },
  autoplayActive: {
    backgroundColor: '#28a745',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  qrCodeWrapper: {
    alignItems: 'center',
  },
});