import { useQrIoTbStore } from "@/src/contexts/QrIoStorageContext";
import { View, Text } from "react-native";;
import { useEffect, useState } from "react";
import { ContentAcquisitionFrameRecord, TxStreamId } from "@/src/types/database";
import { TxStreamIdFramesView } from "./TxStreamIdFramesView";


export const FramesWithoutRecognizedStreamsView = () => {

  const { queryApi } = useQrIoTbStore();

  const [unrecognizedStreamFrames, setUnrecognizedStreamFrames] = 
    useState<Map<TxStreamId, ContentAcquisitionFrameRecord[]>>(new Map());

  useEffect(() => {
    queryApi
      .getFramesWithUnrecognizedStreams()
      .then((frames) => {
        const unrecognizedStreamFrames = frames.reduce((acc, frame) => {
          acc.set(frame.txStreamId, [...(acc.get(frame.txStreamId) || []), frame]);
          return acc;
        }, new Map<TxStreamId, ContentAcquisitionFrameRecord[]>());
        console.log('FramesWithoutRecognizedStreamsView: Unrecognized stream frames:', unrecognizedStreamFrames);
        setUnrecognizedStreamFrames(unrecognizedStreamFrames);
      });
  }, []);

  const orderedTxStreamIds = Array
    .from(unrecognizedStreamFrames.keys())
    .sort();


  return (
    <View>
      <Text>Frames Without Recognized Streams</Text>
      {orderedTxStreamIds.map((txStreamId) => {
        const frames = unrecognizedStreamFrames.get(txStreamId);
        if (!frames) {
          return null;
        }

        return (
          <TxStreamIdFramesView 
            key={txStreamId} 
            txStreamId={txStreamId}
            frames={frames} 
          />
        );
      })}
    </View>
  );
};
