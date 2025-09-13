import { QrContentFrameTxData } from "@/protobufs/protofiles-out/qr-io";
import { View, Text, StyleSheet } from "react-native";

interface FrameAnalyzerContentDetailsProps {
  content: QrContentFrameTxData;
}

export const FrameAnalyzerContentDetails = ({ content }: FrameAnalyzerContentDetailsProps) => {
  const { contentTxId, txContent } = content;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getContentPreview = (): string => {
    if (!txContent) return 'No content data';
    
    switch (txContent.content.oneofKind) {
      case 'textContent':
        const text = txContent.content.textContent;
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
      case 'bytesContent':
        const bytes = txContent.content.bytesContent;
        return `${formatBytes(bytes.length)} of binary data`;
      default:
        return 'Unknown content type';
    }
  };

  const getContentType = (): string => {
    if (!txContent) return 'Unknown';
    
    switch (txContent.content.oneofKind) {
      case 'textContent':
        return 'Text';
      case 'bytesContent':
        return 'Binary';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Content Details</Text>
      
      {/* Content Transaction ID */}
      {contentTxId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction ID</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stream ID:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {contentTxId.txStreamId}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Content Index:</Text>
            <Text style={styles.infoValue}>
              {contentTxId.thisContentIndex}
            </Text>
          </View>
        </View>
      )}

      {/* Content Data */}
      {txContent && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Data</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>
              {getContentType()}
            </Text>
          </View>
          
          {txContent.content.oneofKind === 'textContent' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Length:</Text>
              <Text style={styles.infoValue}>
                {txContent.content.textContent.length} characters
              </Text>
            </View>
          )}
          
          {txContent.content.oneofKind === 'bytesContent' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Size:</Text>
              <Text style={styles.infoValue}>
                {formatBytes(txContent.content.bytesContent.length)}
              </Text>
            </View>
          )}
          
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Preview:</Text>
            <Text style={styles.previewText} numberOfLines={3}>
              {getContentPreview()}
            </Text>
          </View>
        </View>
      )}

      {/* No Content State */}
      {!txContent && (
        <View style={styles.noContentContainer}>
          <Text style={styles.noContentText}>No content data available</Text>
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
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  previewSection: {
    marginTop: 6,
  },
  previewLabel: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 10,
    color: '#ccc',
    fontFamily: 'monospace',
    lineHeight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 6,
    borderRadius: 4,
  },
  noContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  noContentText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});