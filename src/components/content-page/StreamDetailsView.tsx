import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useQrIoTbStore } from "@/src/contexts/QrIoStorageContext";
import { ContentAcquisitionFrameRecord, ContentAcquisitionStreamRecord, ContentHash } from "@/src/types/database";
import { combineFrameData, downloadStreamData } from "@/src/utils/download-utils";
import { generateQrIoBytesContentHash } from "@/src/utils/qrCodeUtils";
import { useApp } from "@/src/contexts/AppContext";


interface StreamDetailsViewProps {
  stream: ContentAcquisitionStreamRecord;
  onShowFrameDetails: () => void;
}

export const StreamDetailsView = ({ stream, onShowFrameDetails }: StreamDetailsViewProps) => {
  
  const { queryApi } = useQrIoTbStore();
  const { backendApi, settings } = useApp();

  const [isDownloading, setIsDownloading] = useState(false);
  const [computedContentLength, setComputedContentLength] = useState<number | null>(null);
  const [computedContentHash, setComputedContentHash] = useState<ContentHash | null>(null);

  const [acquiredFrames, setAcquiredFrames] = useState<ContentAcquisitionFrameRecord[] | null>(null);

  useEffect(() => {
    const frames = queryApi.getFramesForStreamId(stream.txStreamId);
    setAcquiredFrames(frames);
  }, [stream.txStreamId]);

  const handleDownload = async () => {
    await backendApi.downloadStream(queryApi, stream.txStreamId);
  };

  useEffect(() => {
    if (acquiredFrames === null) {
      return;
    }
    const combinedData = combineFrameData(stream, acquiredFrames);
    generateQrIoBytesContentHash(combinedData)
      .then(result => {
        setComputedContentHash(result);
      })
      .catch(error => {
        console.error(error);
      });
    setComputedContentLength(combinedData.length);
  }, [acquiredFrames]);


  return (
    <View style={styles.content}>
      <Text style={styles.detailText}>Content Name: {stream.contentName}</Text>
      <Text style={styles.detailText}>MIME Type: {stream.mimeType}</Text>
      <Text style={styles.detailText}>Content Time: {stream.createdAt}</Text>
      <Text style={styles.detailText}>Expected Content Length: {stream.contentLength}</Text>
      <Text style={styles.detailText}>Computed Content Length: {computedContentLength}</Text>
      <Text style={styles.detailText}>Frame Count: {stream.totalFrameCount}</Text>
      <Text style={styles.detailText}>Num Frames Acquired: {acquiredFrames?.length}</Text>
      <Text style={styles.detailText}>Stream ID: {stream.txStreamId}</Text>
      <Text style={styles.detailText}>Expected Content Hash: {stream.contentHashB64}</Text>
      <Text style={styles.detailText}>Computed Content Hash: {computedContentHash?.contentHashB64}</Text>

      <TouchableOpacity 
        style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]} 
        onPress={handleDownload}
        disabled={isDownloading}
      >
        <Text style={styles.downloadButtonText}>
          {isDownloading ? 'Downloading...' : 'Download Content'}
        </Text>
      </TouchableOpacity>

       {settings.debugMode ? (
         <TouchableOpacity 
           style={styles.frameDetailsButton} 
           onPress={onShowFrameDetails}
         >
           <Text style={styles.frameDetailsButtonText}>
             Show Frame Details
           </Text>
         </TouchableOpacity>
       ) : null}

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  content: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  frameDetailsButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  frameDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
