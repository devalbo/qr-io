import { Store } from "tinybase";
import { CONTENT_STREAMS_TABLE, SCANNED_CONTENT_TABLE } from "../qrio-backend-types";
import { ContentAcquisitionFrameRecord, ContentAcquisitionStreamRecord } from "@/src/types/database";


export const addContentStreamToStore = (store: Store, contentAcquisitionStreamRecord: ContentAcquisitionStreamRecord) => {  

  const contentMetadataKey = contentAcquisitionStreamRecord.txStreamId;

  if (!contentMetadataKey) {
    console.log('addContentMetadataToStore: No content metadata key found');
    return;
  }

  store.setRow(CONTENT_STREAMS_TABLE, contentMetadataKey, contentAcquisitionStreamRecord);
}


export const addContentFrameToStore = (store: Store, contentFrame: ContentAcquisitionFrameRecord) => {  

  const contentFrameKey = contentFrame.txStreamId + '-' + contentFrame.contentIndex;

  if (!contentFrameKey) {
    console.log('addContentFrameToStore: No content frame key found');
    return;
  }

  store.setRow(SCANNED_CONTENT_TABLE, contentFrameKey, contentFrame);
}
