import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { QrDataFrame } from "@/protobufs/protofiles-out/qr-io";
import { addFrameToDatabase } from "@/src/utils/database-utils";
import { useQrIoTbStore } from "@/src/contexts/QrIoStorageContext";


interface DebugContentProps {
  frames: QrDataFrame[];
  activeFrameIndex: number;
}

export const DebugContent = ({ frames, activeFrameIndex }: DebugContentProps) => {

  const { store } = useQrIoTbStore();

  const reassembleFrames = () => {
    // const frames = frames.map(frame => frame.frame);
    // return frames;
  };

  const archiveCurrentFrameToStore = () => {
    // const frames = frames.map(frame => frame.frame);
    // return frames;
  };

  const archiveFramesToStore = async() => {
    frames.forEach(frame => {
      addFrameToDatabase(store, frame);
    });
  };

  return (
    <View style={styles.inputSection}>
      <TouchableOpacity onPress={() => reassembleFrames()}>
        <Text>Reassemble Frames</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => archiveCurrentFrameToStore()}>
        <Text>Archive Current Frame [{activeFrameIndex}] to Store</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => archiveFramesToStore()}>
        <Text>Archive All Frames to Store</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => setActiveFrameIndex(activeFrameIndex + 1)}>
        <Text>Next Frame</Text>
      </TouchableOpacity>
      <Text>Debug Content</Text> */}
    </View>
  );
};


const styles = StyleSheet.create({
  inputSection: {
    marginTop: 20,
  },
});