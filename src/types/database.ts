import { z } from "zod";
import { ContentHashAlgorithm, DataContentBlob, DataTransferBlob } from "@/protobufs/protofiles-out/qr-io";


export const ContentHashSchema = z.object({
  contentHashB64: z.string(),
  contentHashAlgorithm: z.enum(ContentHashAlgorithm),
});

export type ContentHash = z.infer<typeof ContentHashSchema>;


export const TxStreamIdSchema = z.string()
  .startsWith('txs-')
  .brand('TxStreamId');


export const ContentAcquisitionIdSchema = z.object({
  txStreamId: TxStreamIdSchema,
  frameIndex: z.number(),
});

export type TxStreamId = z.infer<typeof TxStreamIdSchema>;

export type ContentAcquisitionId = z.infer<typeof ContentAcquisitionIdSchema>;

export type DataTransferBlobContentOneOfKind = DataTransferBlob['content']['oneofKind'];
export type DataTransferBlobContentEncoding = Exclude<DataTransferBlobContentOneOfKind, undefined>;


const DataTransferBlobContentEncodingSchema = z.enum([
  'textContent',
  'bytesContentB64',
  // 'bytesBase64Content',
]);


const EncodedContentDataSchema = z.discriminatedUnion('contentEncoding', [
  z.object({
    contentEncoding: z.literal('textContent'),
    contentData: z.string(),
  }),
  z.object({
    contentEncoding: z.literal('bytesContentB64'),
    contentData: z.string(),
  }),
  // z.object({
  //   contentEncoding: z.literal('bytesContent'),
  //   contentBytes: z.instanceof(Uint8Array),
  // }),
]);

export type EncodedContentData = z.infer<typeof EncodedContentDataSchema>;


export const ContentAcquisitionFrameRecordSchema = z.object({
  txStreamId: TxStreamIdSchema,
  // frameIndex: z.number(),
  contentIndex: z.number(),
  
  contentEncoding: DataTransferBlobContentEncodingSchema,
  contentData: z.string(),

  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string"
  }),
});


export type ContentAcquisitionFrameRecord = z.infer<typeof ContentAcquisitionFrameRecordSchema>;

export const ContentAcquisitionStreamRecordSchema = z.object({
  txStreamId: TxStreamIdSchema,
  totalFrameCount: z.number(),

  contentName: z.string(),
  mimeType: z.string(),

  contentHashB64: z.string(),
  hashAlgorithm: z.enum(ContentHashAlgorithm),
  contentLength: z.number(),

  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string"
  }),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string"
  }),
});

export type ContentAcquisitionStreamRecord = z.infer<typeof ContentAcquisitionStreamRecordSchema>;


export type DataContentBlobBytesOnly = DataContentBlob & {
  content: {
    oneofKind: "bytesContent";
    bytesContent: Uint8Array;
  };
};


export type DataContentBlobTextOnly = DataContentBlob & {
  content: {
    oneofKind: "textContent";
    textContent: string;
  };
};

export type DataContentBlobWithData = DataContentBlobBytesOnly | DataContentBlobTextOnly;

export type DataContentBlobContentOneOfKind = DataContentBlob['content']['oneofKind'];
export type DataContentBlobContentEncoding = Exclude<DataContentBlobContentOneOfKind, undefined>;
