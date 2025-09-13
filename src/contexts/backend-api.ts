import { Alert } from "react-native";
import { TxStreamId } from "../types/database";
import { downloadStreamData } from "../utils/download-utils";
import { IBackendApi, IQrIoTbStoreQueryApi } from "./qrio-backend-types";


export const BackendApi: IBackendApi = {
  deleteStream: async (queryApi: IQrIoTbStoreQueryApi, streamId: TxStreamId) => {
    console.log('deleteStream: ', streamId);
    queryApi.deleteStream(streamId);
  },
  downloadStream: async (queryApi: IQrIoTbStoreQueryApi, streamId: TxStreamId) => {
    const stream = queryApi.getStreamById(streamId);
    if (!stream) {
      throw new Error('Stream not found');
    }
    const frames = queryApi.getFramesForStreamId(streamId);
    if (!frames) {
      throw new Error('Frames not found');
    }

    if (frames.length !== stream.totalFrameCount) {
      throw new Error('Expected frames length does not match total frame count');
    }

    await downloadStreamData(stream, frames);
    console.log('downloadStream: ', streamId);

    Alert.alert('Success', 'File downloaded successfully!');
  },

  // const handleDownload = async () => {
  //   try {
  //     if (acquiredFrames === null) {
  //       Alert.alert('No Data', 'No frame data available for this stream.');
  //       return;
  //     }

  //     setIsDownloading(true);

  //     console.log('handleDownload: Acquired frames:', acquiredFrames);
      
  //     if (acquiredFrames.length === 0) {
  //       Alert.alert('No Data', 'No frame data available for this stream.');
  //       return;
  //     }

  //     await downloadStreamData(stream, acquiredFrames);
  //     Alert.alert('Success', 'File downloaded successfully!');
  //   } catch (error) {
  //     console.error('Download error:', error);
  //     Alert.alert('Download Failed', 'Failed to download the file. Please try again.');
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };
};