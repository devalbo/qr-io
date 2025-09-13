import { z } from 'zod';
import { ContentTxIdSchema } from './content-tx-id';
import { ContentDataTransferType } from '@/protobufs/protofiles-out/qr-io';


export const ContentTxParametersSchema = z.object({
  contentTxId: ContentTxIdSchema,
  contentName: z.string(),
  contentDataTransferType: z.enum(ContentDataTransferType),
  contentMimeType: z.string(),
  expectedTxFramesPerSecond: z.number(),
  expectedTotalFrameCount: z.number(),
});
