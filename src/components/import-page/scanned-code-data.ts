import { QrDataFrame } from "@/protobufs/protofiles-out/qr-io";


export interface ScannedCodeData {
  bytes: Uint8Array;
  qrDataFrame?: QrDataFrame;
  jsonContent?: string;
  error?: string;
}
