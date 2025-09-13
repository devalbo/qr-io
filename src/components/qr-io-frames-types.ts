import { z } from "zod";
import { DataContentBlobWithData } from "../types/database";


export type ContentTypeAndData = DataContentBlobWithData & {
  contentTitle: string;
  contentMimeType: string;
}


export const ProtobufBytesEncodedAsBase64Schema = z.string().brand('ProtobufBytesEncodedAsBase64');
export type ProtobufBytesEncodedAsBase64 = z.infer<typeof ProtobufBytesEncodedAsBase64Schema>;
