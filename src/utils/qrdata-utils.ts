import { DataTransferBlob, QrDataFrame, QrDataFrameContentId } from "@/protobufs/protofiles-out/qr-io";
import { TxStreamId } from "../types/database";
import { ContentTypeAndData } from "../components/qr-io-frames-types";
import { encodeBinaryDataForQRDataFrames, encodeTextForQRDataFrames } from "./qrCodeUtils";


export const getFrameStreamId = (frame: QrDataFrame | undefined): TxStreamId | null => {
  if (!frame) {
    return null;
  }
  switch (frame.frame.oneofKind) {
    case 'header':
      return frame.frame.header.txStreamMetadata?.txStreamId as TxStreamId ?? null;
    case 'contentTx':
      return frame.frame.contentTx.contentTxId?.txStreamId as TxStreamId ?? null;
    default:
      return null;
  }
}

export const getFrameContentId = (frame: QrDataFrame | undefined): QrDataFrameContentId | null => {
  if (!frame) {
    return null;
  }

  switch (frame.frame.oneofKind) {
    case 'header':
      return frame.frame.header.contentTxData?.contentTxId ?? null;
    case 'contentTx':
      return frame.frame.contentTx.contentTxId ?? null;
    default:
      return null;
  }
}

export const getFrameDataTransferBlob = (frame: QrDataFrame | undefined): DataTransferBlob | null => {
  if (!frame) {
    return null;
  }
  switch (frame.frame.oneofKind) {
    case 'header':
      return frame.frame.header.contentTxData?.txContent ?? null;
    case 'contentTx':
      return frame.frame.contentTx.txContent ?? null;
    default:
      return null;
  }
}


export const convertContentTxDataToQrDataFrames = async (content: ContentTypeAndData | null, chunkSize: number): Promise<QrDataFrame[]> => {

  if (!content) {
    return [];
  }

  if (content.content.oneofKind === 'bytesContent') {
    const binaryFrames = encodeBinaryDataForQRDataFrames(content.contentTitle, content.contentMimeType, content.content.bytesContent, chunkSize);
    return binaryFrames;
  } 
  
  if (content.content.oneofKind === 'textContent') {
    const contentString = content.content.textContent;
    const textFrames = encodeTextForQRDataFrames(content.contentTitle, contentString, chunkSize);
    return textFrames;
  } 
  
  console.error('Invalid content', content);
  throw new Error('Invalid content');
}
