import { QrDataFrame, QrHeaderFrameData, QrContentFrameTxData } from "@/protobufs/protofiles-out/qr-io";
import { convertQrContentTxDataToContentAcquisitionFrameRecord, convertQrHeaderFrameDataToContentAcquisitionStreamRecord } from "./qr-db-mapping-utils";
import { addContentFrameToStore, addContentStreamToStore } from "../contexts/storage/tb-data";
import { Store } from "tinybase";


const addHeaderFrameToDatabase = async (store: Store, frame: QrHeaderFrameData): Promise<void> => {
  console.log('addHeaderFrameToDatabase: Adding header frame to database', frame);

  const streamRecord = convertQrHeaderFrameDataToContentAcquisitionStreamRecord(frame);

  console.log("Converted header frame to stream record", streamRecord);

  if (!streamRecord) {
    console.log('addHeaderFrameToDatabase: No valid stream record for header frame');
    return;
  }

  console.log("Adding header stream record to database", streamRecord);
  addContentStreamToStore(store, streamRecord);

  if (!frame.contentTxData) {
    console.log('addHeaderFrameToDatabase: No content tx data found in header frame');
    return;
  }

  const contentFrame = convertQrContentTxDataToContentAcquisitionFrameRecord(frame.contentTxData);

  console.log("Adding header content frame to database", contentFrame);

  if (!contentFrame) {
    console.log('addHeaderFrameToDatabase: No valid content frame for header frame');
    return;
  }

  addContentFrameToStore(store, contentFrame);

  console.log("Added header frame to database", streamRecord.txStreamId, contentFrame.contentIndex);
};


const addContentFrameToDatabase = async (store: Store, frame: QrContentFrameTxData): Promise<void> => {
  console.log('addContentFrameToDatabase: Adding content frame to database', frame);

  const contentFrame = convertQrContentTxDataToContentAcquisitionFrameRecord(frame);

  if (!contentFrame) {
    console.log('addContentFrameToDatabase: No valid content frame for content frame');
    return;
  }

  addContentFrameToStore(store, contentFrame);
};


export const addFrameToDatabase = async (store: Store, frame: QrDataFrame): Promise<void> => {
  console.log('addFrameToDatabase: Adding frame to database', frame);
  if (frame.frame.oneofKind === 'header') {
    return addHeaderFrameToDatabase(store, frame.frame.header);
  } else if (frame.frame.oneofKind === 'contentTx') {
    return addContentFrameToDatabase(store, frame.frame.contentTx);
  } else {
    console.log('addFrameToDatabase: Unknown frame type');
    return Promise.resolve();
  }
};
