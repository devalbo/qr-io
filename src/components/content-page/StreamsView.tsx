import { useQrIoTbStore } from "@/src/contexts/QrIoStorageContext";
import { View, Text } from "react-native";
import { StreamPage } from "./StreamPage";


export const StreamsView = () => {

  const { queryApi, data } = useQrIoTbStore();
  const { allStreams } = data;

  if (allStreams.length === 0) {
    return (
      <View>
        <Text>No streams found</Text>
      </View>
    );
  }

  return (
    <View>
      {allStreams.map((stream) => (
        <StreamPage key={stream.txStreamId} stream={stream} />
      ))}
    </View>
  );
};
