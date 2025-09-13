import { View, Text, StyleSheet } from "react-native";
import { ContentAcquisitionFrameRecord, ContentHash } from "@/src/types/database";
import { generateQrIoBytesContentHash } from "@/src/utils/qrCodeUtils";
import { convertBase64ToBinary } from "@/src/utils/base64-utils";
import { useEffect, useState } from "react";
import { ContentFormatType } from "@/src/types/content-format";


interface SingleFrameDetailsViewProps {
  frame: ContentAcquisitionFrameRecord;
  index: number;
  contentFormat: ContentFormatType | null;
}

export const SingleFrameDetailsView = ({ frame, index, contentFormat }: SingleFrameDetailsViewProps) => {

const [frameContentHash, setFrameContentHash] = useState<ContentHash | null>(null);

const frameContentBytes = frame.contentEncoding === 'bytesContentB64' ? 
  convertBase64ToBinary(frame.contentData) :
  new TextEncoder().encode(frame.contentData);

useEffect(() => {
  generateQrIoBytesContentHash(frameContentBytes)
    .then(result => {
      setFrameContentHash(result);
    })
    .catch(error => {
      console.error(error);
    });
}, [frameContentBytes]);

const encodedContent = frame.contentEncoding === 'bytesContentB64' ?
  convertBase64ToBinary(frame.contentData) :
  new TextEncoder().encode(frame.contentData);

const renderContentByFormat = () => {
  switch (contentFormat) {
    case 'hash':
      return frameContentHash?.contentHashB64 || 'Calculating...';
    case 'string':
      return frame.contentEncoding === 'bytesContentB64' 
        ? new TextDecoder().decode(encodedContent)
        : frame.contentData;
    case 'rawBase64':
    case null:
    default:
      return frame.contentData;
  }
};

  return (
    <View key={`${frame.txStreamId}-${frame.contentIndex}-${index}`} style={styles.frameItem}>
      <Text style={styles.frameIndex}>Frame {index + 1} [{frame.contentIndex}]</Text>
      <Text style={styles.contentEncoding}>Content Encoding: {frame.contentEncoding}</Text>
      <Text style={styles.metadata}>Content Data Length: {frame.contentData.length}</Text>
      <Text style={styles.metadata}>Content Bytes Length: {frameContentBytes.length}</Text>
      <Text style={styles.metadata}>Created At: {frame.createdAt}</Text>
      
      <View style={styles.contentSection}>
        <Text style={styles.contentLabel}>
          Content ({contentFormat === 'hash' ? 'Hash' : contentFormat === 'string' ? 'String' : 'Raw Base64'}):
        </Text>
        <Text style={styles.contentValue}>{renderContentByFormat()}</Text>
      </View>
      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  streamInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 16,
  },
  framesContainer: {
    flex: 1,
  },
  frameItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  frameIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  frameId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  contentIndex: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  contentEncoding: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  contentSection: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contentValue: {
    fontSize: 11,
    color: '#555',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  metadata: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  noFramesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  noFramesText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
