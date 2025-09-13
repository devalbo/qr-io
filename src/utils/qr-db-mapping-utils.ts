import { ContentAcquisitionFrameRecord, ContentAcquisitionStreamRecord, EncodedContentData, TxStreamIdSchema } from "../types/database";
import { DataTransferBlob, QrContentFrameTxData, QrHeaderFrameData } from "@/protobufs/protofiles-out/qr-io";
import { Buffer } from "buffer";


const createDefaultContentName = (now: Date): string => {
  return `content-${now.toISOString()}`;
};

const createDefaultMimeType = (now: Date): string => {
  return `application/octet-stream`;
};


export const convertQrHeaderFrameDataToContentAcquisitionStreamRecord = (headerFrame: QrHeaderFrameData): ContentAcquisitionStreamRecord | null => {

  const streamMetadata = headerFrame.txStreamMetadata;

  if (!streamMetadata) {
    console.log('convertQrHeaderFrameDataToContentAcquisitionStreamRecord: streamMetadata is required');
    return null;
  }

  if (!streamMetadata.txStreamId) {
    console.log('convertQrHeaderFrameDataToContentAcquisitionStreamRecord: txStreamId is required');
    return null;
  }

  const finalDataContentId = streamMetadata.finalDataContentId;

  if (!finalDataContentId) {
    console.log('convertQrHeaderFrameDataToContentAcquisitionStreamRecord: finalDataContentId is required');
    return null;
  }

  if (!finalDataContentId.finalContentHashB64) {
    console.log('convertQrHeaderFrameDataToContentAcquisitionStreamRecord: finalContentHashB64 is required');
    return null;
  }

  if (!finalDataContentId.contentHashAlgorithm) {
    console.log('convertQrHeaderFrameDataToContentAcquisitionStreamRecord: contentHashAlgorithm is required');
    return null;
  }

  const txStreamId = TxStreamIdSchema.safeParse(streamMetadata.txStreamId);
  if (!txStreamId.success) {
    console.log('convertQrHeaderFrameDataToContentAcquisitionStreamRecord: valid txStreamId is required - got:', streamMetadata.txStreamId);
    return null;
  }
  
  const now = new Date();
  const nowStr = now.toISOString();

  console.log("headerFrame", headerFrame);
  console.log("finalDataContentId", finalDataContentId);

  const contentLength = finalDataContentId.finalContentBytesSize;

  const retVal = {
    txStreamId: txStreamId.data,
    totalFrameCount: streamMetadata.expectedTotalFrameCount,

    contentName: streamMetadata.contentName || createDefaultContentName(now),
    mimeType: streamMetadata.contentMimeType || createDefaultMimeType(now),
    contentHashB64: finalDataContentId.finalContentHashB64,
    hashAlgorithm: finalDataContentId.contentHashAlgorithm,
    contentLength,

    createdAt: nowStr,
    updatedAt: nowStr,
  } satisfies ContentAcquisitionStreamRecord;

  console.log('convertQrHeaderFrameDataToContentAcquisitionStreamRecord: retVal', retVal);

  return retVal;
};


const parseDataTransferBlob = (dataTransferBlob: DataTransferBlob): EncodedContentData | null => {

  if (!dataTransferBlob.content.oneofKind) {
    console.log('parseDataTransferBlob: dataTransferBlob.content.oneofKind is required');
    return null;
  }

  const encoding = dataTransferBlob.content.oneofKind;

  switch (encoding) {
    case 'textContent':
      return { contentEncoding: encoding, contentData: dataTransferBlob.content.textContent };
    case 'bytesContent':
      const contentBytes = new Uint8Array(dataTransferBlob.content.bytesContent);
      const contentBytesB64 = Buffer.from(contentBytes).toString('base64');
      return { contentEncoding: 'bytesContentB64', contentData: contentBytesB64, };
    default:
      console.log('parseDataTransferBlob: invalid encoding:', encoding);
      return null;
  }
};

export const convertQrContentTxDataToContentAcquisitionFrameRecord = (contentTxData: QrContentFrameTxData): ContentAcquisitionFrameRecord | null => {

  if (!contentTxData.contentTxId) {
    console.log('convertQrContentTxDataToContentAcquisitionFrameRecord: contentTxId is required');
    return null;
  }

  const txStreamId = TxStreamIdSchema.safeParse(contentTxData.contentTxId.txStreamId);
  if (!txStreamId.success) {
    console.log('convertQrContentTxDataToContentAcquisitionFrameRecord: valid txStreamId is required - got:', contentTxData.contentTxId.txStreamId);
    return null;
  }

  const now = new Date();
  const nowStr = now.toISOString();

  if (!contentTxData.txContent) {
    console.log('convertQrContentTxDataToContentAcquisitionFrameRecord: txContent is required');
    return null;
  }

  const parsedValue = parseDataTransferBlob(contentTxData.txContent);
  if (parsedValue === null) {
    console.log('convertQrContentTxDataToContentAcquisitionFrameRecord: invalid txContent');
    return null;
  }

  const { contentEncoding, contentData } = parsedValue;


  const retVal = {
    txStreamId: txStreamId.data,
    contentIndex: contentTxData.contentTxId.thisContentIndex,
    contentEncoding,
    contentData,
    createdAt: nowStr,
  } satisfies ContentAcquisitionFrameRecord;

  return retVal;
};
