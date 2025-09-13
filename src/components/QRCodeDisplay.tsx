import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getQRCodeSize } from '../utils/qrCodeUtils';
import { ProtobufBytesEncodedAsBase64 } from './qr-io-frames-types';

const { width: screenWidth } = Dimensions.get('window');
const QR_SIZE = getQRCodeSize(screenWidth);

interface QRCodeDisplayProps {
  data: ProtobufBytesEncodedAsBase64 | null;
  maxBytesPerQrCode: number;
  title?: string;
  debug?: boolean;

  onError?: (error: any) => void;
}

export const QRCodeDisplay = ({
  data,
  maxBytesPerQrCode,
  title = 'QR Code Export',
  debug = false,

  onError,
}: QRCodeDisplayProps) => {
  const [qrError, setQrError] = useState<Error | null>(null);

  const handleQRError = (error: any) => {
    console.error('QR Code error:', error);
    setQrError(error);
    if (onError) {
      onError(error);
    }
  };

  const handleRetry = () => {
    setQrError(null);
  };

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>No data available for QR code generation</Text>
      </View>
    );
  }

  // console.log('data', data);
  // console.log('data.length', data.length);

  if (qrError) {
    console.log('qrError', qrError);
    console.log('maxBytesPerQrCode', maxBytesPerQrCode);
    console.log('data', data);

    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>QR Code Error</Text>
        <Text style={styles.errorMessage}>
          Failed to generate QR code (frame size {maxBytesPerQrCode}): {qrError.message}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>🔄 Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>No data available for QR code generation</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCode
          value={data}
          size={QR_SIZE}
          color="black"
          backgroundColor="white"
          ecl="M"
          onError={handleQRError}
        />
        {debug && (
          <>
            <Text style={styles.qrText}>{data?.length} QR content bytes</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // margin: 16,
    // padding: 20,
    // borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  qrContainer: {
    // padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  qrInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  qrInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  qrText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
});
