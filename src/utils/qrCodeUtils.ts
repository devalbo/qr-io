import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';
import { ContentHashAlgorithm, DataContentBlob, DataTransferBlob, FinalDataContentId, QrContentFrameTxData, QrDataFrame, QrDataFrameContentId, QrHeaderFrameData, QrTxStreamMetadata } from '@/protobufs/protofiles-out/qr-io';
import { convertBinaryToBase64 } from './base64-utils';
import { DataContentBlobContentEncoding, DataContentBlobTextOnly, DataContentBlobWithData, TxStreamId } from '../types/database';
import { ContentHash } from '../types/database';
import { ProtobufBytesEncodedAsBase64 } from '../components/qr-io-frames-types';


const chunkBytes = (array: Uint8Array, size: number): Uint8Array[] => {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};


const chunkTextContent = (content: string, size: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < content.length; i += size) {
    chunks.push(content.slice(i, i + size));
  }
  return chunks;
};


const chunkDataContent = (dataContent: DataContentBlob, size: number): DataContentBlob[] => {
  switch (dataContent.content.oneofKind) {
    case 'textContent':
      const chunkStrings = chunkTextContent(dataContent.content.textContent, size);
      console.log('chunkDataContent: Chunked text content into', chunkStrings.length, 'chunks');
      console.log('chunkDataContent: Chunked text content:', chunkStrings);

      const stringDcBlobs = chunkStrings.map(text => ({
        content: {
          oneofKind: 'textContent',
          textContent: text,
        },
        contentLength: text.length,
      } satisfies DataContentBlob));
      return stringDcBlobs;
    case 'bytesContent':
      const chunkBytesArray = chunkBytes(dataContent.content.bytesContent, size);
      const bytesDcBlobs = chunkBytesArray.map(bytes => ({
        content: {
          oneofKind: 'bytesContent',
          bytesContent: bytes,
        },
        contentLength: bytes.length,
      } satisfies DataContentBlob));
      return bytesDcBlobs;
    default:
      throw new Error('Invalid data content type', dataContent.content.oneofKind);
  }
};


export const generateQrIoBytesContentHash = async (content: Uint8Array): Promise<ContentHash> => {
  // Use expo-crypto for SHA-256
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Buffer.from(content).toString('base64')
  );

  const hashStr = hash.substring(0, 8);
  
  return {
    contentHashB64: hashStr,
    contentHashAlgorithm: ContentHashAlgorithm.QRIO,
  } satisfies ContentHash;
};


const generateQrIoTextContentHash = async (content: string): Promise<ContentHash> => {
  const strBytes = textToBytes(content);
  const contentHash = await generateQrIoBytesContentHash(strBytes);
  return contentHash;
};


export const generateQrIoContentHash = async (content: DataContentBlob): Promise<ContentHash> => {
  switch (content.content.oneofKind) {
    case 'textContent': {
      const contentHash = await generateQrIoTextContentHash(content.content.textContent);
      return contentHash;
    }
    case 'bytesContent': {
      const contentHash = await generateQrIoBytesContentHash(content.content.bytesContent);
      return contentHash;
    }
  }
  throw new Error('Invalid data content type', content.content.oneofKind);
};


const convertContentHashToTxStreamId = (contentHash: ContentHash): TxStreamId => {  
  if (contentHash.contentHashAlgorithm !== ContentHashAlgorithm.QRIO) {
    throw new Error(`Invalid content hash algorithm: ${contentHash.contentHashAlgorithm}`);
  }
  const retVal = 'txs-' + contentHash.contentHashB64;
  return retVal as TxStreamId;
};


const generateQrIoContentStreamId = async (content: DataContentBlob): Promise<TxStreamId> => {
  switch (content.content.oneofKind) {
    case 'textContent': {
      const contentHash = await generateQrIoTextContentHash(content.content.textContent);
      return convertContentHashToTxStreamId(contentHash);
    }
    case 'bytesContent': {
      const contentHash = await generateQrIoBytesContentHash(content.content.bytesContent);
      return convertContentHashToTxStreamId(contentHash);
    }
    default:
      throw new Error('Invalid data content type', content.content.oneofKind);
  }
};


const encodeDataToQrHeaderDataFrame = async (
  dataContent: DataContentBlob,
  dataChunks: DataContentBlob[],
  contentTxId: TxStreamId,
  contentHash: ContentHash,
  contentName: string,
  contentMimeType: string,
  expectedBytesPerFrame: number,
): Promise<QrDataFrame> => {

  // console.log('encodeDataToQrHeaderDataFrame: dataContent', dataContent);

  const finalDataContentId = {
    finalContentHashB64: contentHash.contentHashB64,
    contentHashAlgorithm: contentHash.contentHashAlgorithm,
    finalContentBytesSize: dataContent.contentLength,
  } satisfies FinalDataContentId;

  const expectedTotalFrameCount = dataChunks.length;

  const txMetadata = {
    txStreamId: contentTxId,
    contentName,
    expectedBytesPerFrame,
    expectedTotalFrameCount,
    contentMimeType,
    finalDataContentId,
  } satisfies QrTxStreamMetadata;
  
  const firstChunk = dataChunks[0];
  const contentTxData = await encodeDataToQrContentDataFrame(firstChunk, contentTxId, 0);

  // const firstChunkHash = await generateQrIoContentHash(firstChunk);
  // console.log('encodeDataToQrHeaderDataFrame: firstChunkHash', firstChunkHash);

  return {
    frame: {
      oneofKind: 'header',
      header: {
        txStreamMetadata: txMetadata,
        contentTxData,
      }
    }
  };
};

const encodeDataToQrContentDataFrame = async (
  dataContent: DataContentBlob,
  contentTxId: TxStreamId,
  contentIndex: number,
): Promise<QrContentFrameTxData> => {

  // console.log('encodeDataToQrContentDataFrame: contentTxId', contentTxId);
  // console.log('encodeDataToQrContentDataFrame: contentIndex', contentIndex);
  // console.log('encodeDataToQrContentDataFrame: dataContent', dataContent);
  // const dataContentHash = await generateQrIoContentHash(dataContent);
  // console.log('encodeDataToQrContentDataFrame: dataContentHash', dataContentHash);

  const frameContentId = {
    txStreamId: contentTxId,
    thisContentIndex: contentIndex,
  } satisfies QrDataFrameContentId;

  const frameData = {
    contentTxId: frameContentId,
    txContent: dataContent,
  } satisfies QrContentFrameTxData;

  // console.log('encodeDataToQrHeaderDataFrame: firstChunkHash', firstChunkHash);


  return frameData;
};


const encodeDataToQrDataFrames = async (
  dataContent: DataContentBlob,
  contentName: string,
  chunkSize: number,
  contentMimeType: string,
): Promise<QrDataFrame[]> => {

  const dataChunks = chunkDataContent(dataContent, chunkSize);
  const contentHash = await generateQrIoContentHash(dataContent);
  const contentTxId = await generateQrIoContentStreamId(dataContent);

  // console.log('encodeDataToQrDataFrames: contentLength', dataContent.contentLength);
  // console.log('encodeDataToQrDataFrames: contentName', contentName);
  // console.log('encodeDataToQrDataFrames: contentMimeType', contentMimeType);
  // console.log('encodeDataToQrDataFrames: contentHash', contentHash);
  // console.log('encodeDataToQrDataFrames: dataChunks', dataChunks);

  const qrDataFrames = await Promise.all(dataChunks.map(async (chunk, index) => {
    if (index === 0) {
      const headerDataFrame = await encodeDataToQrHeaderDataFrame(
        dataContent,
        dataChunks,
        contentTxId,
        contentHash,
        contentName,
        contentMimeType,
        chunkSize);

      return headerDataFrame;
    } else {
      const contentDataFrame = await encodeDataToQrContentDataFrame(
        chunk,
        contentTxId,
        index * chunkSize);

      return {
        frame: {
          oneofKind: 'contentTx' as const,
          contentTx: contentDataFrame,
        }
      };
    }
  }));

  return qrDataFrames;
};


export const encodeBinaryDataForQRDataFrames = async (contentName: string, contentMimeType: string, dataBytes: Uint8Array, chunkSize: number): Promise<QrDataFrame[]> => {

  const binaryDataContent = {
    content: {
      oneofKind: 'bytesContent',
      bytesContent: dataBytes,
    },
    contentLength: dataBytes.length,
  } satisfies DataContentBlob;

  const qrDataFrames = await encodeDataToQrDataFrames(
    binaryDataContent,
    contentName,
    chunkSize,
    contentMimeType
  );

  return qrDataFrames;
}


export const encodeTextForQRDataFrames = async (contentName: string, data: string, chunkSize: number): Promise<QrDataFrame[]> => {

  const textDataContent = {
    content: {
      oneofKind: 'textContent',
      textContent: data,
    },
    contentLength: data.length,
  } satisfies DataContentBlobTextOnly;

  const qrDataFrames = await encodeDataToQrDataFrames(
    textDataContent,
    contentName,
    chunkSize,
    'text/plain');

  return qrDataFrames;
}


export const encodeFrameForQR = (frame: QrDataFrame): ProtobufBytesEncodedAsBase64 => {

  try {
    const frameBytes = QrDataFrame.toBinary(frame);
    const frameBytesB64 = convertBinaryToBase64(frameBytes);
    return frameBytesB64 as ProtobufBytesEncodedAsBase64;
  } catch (error) {
    console.error('Error in encodeFrameForQR:', error);
    console.error('Frame that caused error:', JSON.stringify(frame, null, 2));
    throw error;
  }
}


const convertDataTransferBlobToDataContentBlob = (transferBlob: DataTransferBlob): DataContentBlobWithData => {
  switch (transferBlob.content.oneofKind) {
    case 'textContent':
      return {
        content: {
          oneofKind: 'textContent',
          textContent: transferBlob.content.textContent,
        },
        contentLength: transferBlob.content.textContent.length,
      } satisfies DataContentBlobWithData;
    case 'bytesContent':
      return {
        content: {
          oneofKind: 'bytesContent',
          bytesContent: transferBlob.content.bytesContent,
        },
        contentLength: transferBlob.content.bytesContent.length,
      } satisfies DataContentBlobWithData;
    // case 'bytesBase64Content':
    //   // Convert base64 string to Uint8Array
    //   const bytes = Buffer.from(transferBlob.content.bytesBase64Content, 'base64');
    //   return {
    //     content: {
    //       oneofKind: 'bytesContent',
    //       bytesContent: bytes,
    //     },
    //     contentLength: bytes.length,
    //   } satisfies DataContentBlobWithData;
    default:
      throw new Error('Unsupported data transfer blob content type');
  }
};

export const decodeDataFromQRContentDataFrame = (contentDataFrame: QrContentFrameTxData): DataContentBlobWithData => {
  
  if (!contentDataFrame.txContent) {
    throw new Error('No data content blob found in content data frame');
  }
  
  return convertDataTransferBlobToDataContentBlob(contentDataFrame.txContent);
}


export const decodeDataFromQRHeaderDataFrame = (headerDataFrame: QrHeaderFrameData): DataContentBlobWithData => {

  if (!headerDataFrame.contentTxData || !headerDataFrame.contentTxData.txContent) {
    throw new Error('No data content blob found in header data frame');
  }
  
  return convertDataTransferBlobToDataContentBlob(headerDataFrame.contentTxData.txContent);
}

const asTextContentBlob = (content: string): DataContentBlobWithData => {
  return {
    content: {
      oneofKind: 'textContent',
      textContent: content,
    },
    contentLength: content.length,
  } satisfies DataContentBlobWithData;
}

const asBytesContentBlob = (content: Uint8Array): DataContentBlobWithData => {
  return {
    content: {
      oneofKind: 'bytesContent',
      bytesContent: content,
    },
    contentLength: content.length,
  } satisfies DataContentBlobWithData;
}

const createInitialDataContentBlob = (contentOneOfKind: DataContentBlobContentEncoding): DataContentBlobWithData => {

  if (contentOneOfKind === 'textContent') {
    return asTextContentBlob('');
  }

  if (contentOneOfKind === 'bytesContent') {
    return asBytesContentBlob(new Uint8Array());
  }
  
  throw new Error('Invalid data content blob one of kind', contentOneOfKind);
}

const dcbReducer = (acc: DataContentBlobWithData, blob: DataContentBlobWithData): DataContentBlobWithData => {

  if (acc.content.oneofKind === 'textContent' && blob.content.oneofKind === 'textContent') {
    const newTextContent = acc.content.textContent + blob.content.textContent;
    const retVal = {
      content: {
        oneofKind: 'textContent',
        textContent: newTextContent,
      },
      contentLength: newTextContent.length,
    } satisfies DataContentBlobWithData;
    return retVal;
  }
  
  if (acc.content.oneofKind === 'bytesContent' && blob.content.oneofKind === 'bytesContent') {
    const newBytesContent = new Uint8Array(acc.content.bytesContent.length + blob.content.bytesContent.length);
    newBytesContent.set(acc.content.bytesContent);
    newBytesContent.set(blob.content.bytesContent, acc.content.bytesContent.length);
    
    const retVal = {
      content: {
        oneofKind: 'bytesContent',
        bytesContent: newBytesContent,
      },
      contentLength: newBytesContent.length,
    } satisfies DataContentBlobWithData;
    return retVal;
  }

  throw new Error('Data content blobs have different one of kinds');
}


export const concatenateDataContentBlobs = (refBlob: DataContentBlobWithData, dataContentBlobs: DataContentBlobWithData[]): DataContentBlobWithData => {
  const contentOneOfKind = refBlob.content.oneofKind;
  if (contentOneOfKind === undefined) {
    throw new Error('Data content blob one of kind is undefined');
  }

  if (dataContentBlobs.length === 0) {
    throw new Error('No data content blobs provided');
  }

  if (dataContentBlobs.some(blob => blob.content.oneofKind !== contentOneOfKind)) {
    throw new Error('Data content blobs have different one of kinds');
  }

  const initialContent = createInitialDataContentBlob(contentOneOfKind);
  const concatenatedContent = dataContentBlobs.reduce(dcbReducer, initialContent);

  return concatenatedContent;
}


export const decodeDataFromQR = (qrDataFrames: QrDataFrame[]): DataContentBlob => {
  if (qrDataFrames.length === 0) {
    throw new Error('No QR data frames provided');
  }

  const decodedFrames: DataContentBlobWithData[] = qrDataFrames.map(frame => {
    switch (frame.frame.oneofKind) {
      case 'header':
        return decodeDataFromQRHeaderDataFrame(frame.frame.header);
      case 'contentTx':
        return decodeDataFromQRContentDataFrame(frame.frame.contentTx);
      default:
        throw new Error('Invalid QR data frame');
    }
  });

  const concatenatedContent = concatenateDataContentBlobs(decodedFrames[0], decodedFrames);

  return concatenatedContent;
}


export const generateChecksum = async (bytes: Uint8Array): Promise<string> => {
  // Use SHA-256 and take first 2 bytes as checksum for better reliability
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Buffer.from(bytes).toString('base64')
  );
  // Take first 4 characters (2 bytes) of the hash
  return hash.substring(0, 4);
};

// /**
//  * Validates if a string is a valid QR code payload
//  */
// export const isValidQRPayload = (data: string): boolean => {
//   try {
//     const payload = JSON.parse(data) as QRCodePayload;
//     return !!(
//       payload.version &&
//       payload.timestamp &&
//       typeof payload.itemCount === 'number' &&
//       payload.data &&
//       payload.checksum
//     );
//   } catch {
//     return false;
//   }
// };

/**
 * Gets QR code size based on screen width
 */
export const getQRCodeSize = (screenWidth: number): number => {
  return Math.min(screenWidth - 80, 300);
};


export const textToBytes = (text: string): Uint8Array => {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

// export const bytesToText = (bytes: Uint8Array): string => {
//   return String.fromCharCode.apply(null, Array.from(bytes));
// }
