import { Store, TablesSchema, ValuesSchema } from "tinybase";
import { ContentAcquisitionStreamRecord, ContentAcquisitionFrameRecord, TxStreamId } from "../types/database";
import { AppSettings } from "../zod-types/app-settings";


export const SCANNED_CONTENT_TABLE = 'scannedContent';
export const CONTENT_STREAMS_TABLE = 'contentStreams';


export const TB_STORE_TABLES_SCHEMA: TablesSchema = { };


export interface IQrIoTbStoreProviderProps {
  children: React.ReactNode;
}


export interface IQrIoTbData {
  allStreams: ContentAcquisitionStreamRecord[];
}

export interface IQrIoTbStoreQueryApi {
  resetStore: () => Promise<void>;

  setAppSettings: (settings: AppSettings) => void;
  getAppSettings: () => AppSettings;

  getNumFramesReadForStreamId: (streamId: TxStreamId) => number;
  getExpectedTotalFrameCountForStreamId: (streamId: TxStreamId) => number | null;
  getFramesForStreamId: (streamId: TxStreamId) => ContentAcquisitionFrameRecord[];
  getStreamById: (streamId: TxStreamId) => ContentAcquisitionStreamRecord | null;

  getFramesWithUnrecognizedStreams: () => Promise<ContentAcquisitionFrameRecord[]>;

  deleteStream: (streamId: TxStreamId) => Promise<void>;
}


export interface IQrIoTbStoreContextType {
  store: Store;
  data: IQrIoTbData;
  queryApi: IQrIoTbStoreQueryApi;
}


export interface IBackendApi {
  deleteStream: (queryApi: IQrIoTbStoreQueryApi, streamId: TxStreamId) => Promise<void>;
  downloadStream: (queryApi: IQrIoTbStoreQueryApi, streamId: TxStreamId) => Promise<void>;
}
