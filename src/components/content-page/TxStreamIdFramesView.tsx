import { ContentAcquisitionFrameRecord, TxStreamId } from "@/src/types/database";
import { View, Text } from "react-native";
import { SingleFrameDetailsView } from "./SingleFrameDetailsView";


interface TxStreamIdFramesViewProps {
  txStreamId: TxStreamId;
  frames: ContentAcquisitionFrameRecord[];
}

export const TxStreamIdFramesView = ({ 
  txStreamId,
  frames,
}: TxStreamIdFramesViewProps) => {
  return (
    <View>
      <Text>TxStreamIdFramesView: {txStreamId}</Text>
      {frames.map((frame, index) => (
        <SingleFrameDetailsView
          key={frame.txStreamId + '-' + frame.contentIndex}
          frame={frame}
          index={index}
          contentFormat={null}
        />
      ))}
    </View>
  );
};
