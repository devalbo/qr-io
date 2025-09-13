import { QrHeaderFrameData, ContentHashAlgorithm } from "@/protobufs/protofiles-out/qr-io";
import { View, Text, StyleSheet } from "react-native";

interface FrameAnalyzerHeaderDetailsProps {
  header: QrHeaderFrameData;
}

export const FrameAnalyzerHeaderDetails = ({ header }: FrameAnalyzerHeaderDetailsProps) => {
  const { txStreamMetadata, contentTxData } = header;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getHashAlgorithmName = (algorithm: ContentHashAlgorithm): string => {
    switch (algorithm) {
      case ContentHashAlgorithm.QRIO:
        return 'QR-IO';
      case ContentHashAlgorithm.UNSPECIFIED:
        return 'Unspecified';
      default:
        return 'Unknown';
    }
  };

  const getContentPreview = (): string => {
    if (!contentTxData?.txContent) return 'No content data';
    
    switch (contentTxData.txContent.content.oneofKind) {
      case 'textContent':
        const text = contentTxData.txContent.content.textContent;
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
      case 'bytesContent':
        const bytes = contentTxData.txContent.content.bytesContent;
        return `${formatBytes(bytes.length)} of binary data`;
      default:
        return 'Unknown content type';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Header Details</Text>
      
      {/* Stream Metadata */}
      {txStreamMetadata && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stream ID:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {txStreamMetadata.txStreamId}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Content Name:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {txStreamMetadata.contentName || 'Unnamed'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>MIME Type:</Text>
            <Text style={styles.infoValue}>
              {txStreamMetadata.contentMimeType || 'Unknown'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expected Frames:</Text>
            <Text style={styles.infoValue}>
              {txStreamMetadata.expectedTotalFrameCount}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bytes per Frame:</Text>
            <Text style={styles.infoValue}>
              {formatBytes(txStreamMetadata.expectedBytesPerFrame)}
            </Text>
          </View>
        </>
      )}

      {/* Final Data Content ID */}
      {txStreamMetadata?.finalDataContentId && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hash Algorithm:</Text>
            <Text style={styles.infoValue}>
              {getHashAlgorithmName(txStreamMetadata.finalDataContentId.contentHashAlgorithm)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Final Size:</Text>
            <Text style={styles.infoValue}>
              {formatBytes(txStreamMetadata.finalDataContentId.finalContentBytesSize)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Content Hash:</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {txStreamMetadata.finalDataContentId.finalContentHashB64}
            </Text>
          </View>
        </>
      )}

      {/* Content Transaction Data */}
      {contentTxData && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Content Preview:</Text>
          <Text style={styles.infoValue} numberOfLines={3}>
            {getContentPreview()}
          </Text>
        </View>
      )}

      {/* No Data State */}
      {!txStreamMetadata && !contentTxData && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No header data available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  noDataText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});