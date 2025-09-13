import { View, Text } from "react-native";
import { QrDataFrame } from "@/protobufs/protofiles-out/qr-io";
import { TxStreamId } from "@/src/types/database";
import { getFrameDataTransferBlob } from "@/src/utils/qrdata-utils";
import { useQrIoTbStore } from "@/src/contexts/QrIoStorageContext";


interface AllFramesAssemblerProps {
  streamId: TxStreamId | null;
  latestFrame: QrDataFrame | undefined;
}

export const AllFramesAssembler = ({ 
  streamId,
  latestFrame,
 }: AllFramesAssemblerProps) => {

  const { queryApi } = useQrIoTbStore();

  const latestFrameData = getFrameDataTransferBlob(latestFrame);

  const numFramesRead = streamId ? queryApi.getNumFramesReadForStreamId(streamId) : 0;
  const expectedTotalFrameCount = streamId ? queryApi.getExpectedTotalFrameCountForStreamId(streamId) : 0;

  return (
    <View>
      <Text>Stream Assembler</Text>
      <Text>Stream ID: {streamId}</Text>

      <Text>Latest Frame Type: {latestFrame?.frame.oneofKind} / </Text>
      <Text>Latest Frame Data Type: {latestFrameData?.content.oneofKind}</Text>
      {
        latestFrameData?.content.oneofKind === 'textContent' && (
          <Text>Latest Frame Content Length: {latestFrameData?.content.textContent.length}</Text>
        )
      }
      {
        latestFrameData?.content.oneofKind === 'bytesContent' && (
          <Text>Latest Frame Content Length: {latestFrameData?.content.bytesContent.length}</Text>
        )
      }
      <Text>Num Frames Read: {numFramesRead}</Text>
      <Text>Expected Frame Count: {expectedTotalFrameCount}</Text>
    </View>
  );
};
