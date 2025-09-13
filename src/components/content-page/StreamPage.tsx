import { useQrIoTbStore } from "@/src/contexts/QrIoStorageContext";
import { ContentAcquisitionFrameRecord, ContentAcquisitionStreamRecord, ContentHash } from "@/src/types/database";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { StreamDetailsView } from "./StreamDetailsView";
import { FrameInspectorView } from "./FrameInspectorView";


interface StreamPageProps {
  stream: ContentAcquisitionStreamRecord;
}

export const StreamPage = ({ stream }: StreamPageProps) => {
  const { queryApi } = useQrIoTbStore();
  const [showFrameInspector, setShowFrameInspector] = useState(false);
  const [acquiredFrames, setAcquiredFrames] = useState<ContentAcquisitionFrameRecord[] | null>(null);

  useEffect(() => {
    const frames = queryApi.getFramesForStreamId(stream.txStreamId);
    setAcquiredFrames(frames);
  }, [stream.txStreamId]);

  const openFrameInspector = () => {
    setShowFrameInspector(true);
  };

  const closeFrameInspector = () => {
    setShowFrameInspector(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>{stream.contentName}</Text>
        </View>
      </View>
      
      <StreamDetailsView
        stream={stream}
        onShowFrameDetails={openFrameInspector}
      />

      {showFrameInspector ? (
        <FrameInspectorView
          onClose={closeFrameInspector}
          stream={stream}
          frames={acquiredFrames}
        />
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
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  inspectorButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  inspectorIcon: {
    fontSize: 16,
  },
});