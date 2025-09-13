import { Store } from "tinybase";
import { CONTENT_STREAMS_TABLE, SCANNED_CONTENT_TABLE } from "../qrio-backend-types";
import { ContentAcquisitionFrameRecord, ContentAcquisitionFrameRecordSchema, ContentAcquisitionStreamRecord, ContentAcquisitionStreamRecordSchema, TxStreamId } from "@/src/types/database";


export const resetStore = async (store: Store): Promise<void> => {
  store.delTables();
  store.delValues();
};


const getContentFrameForRowId = (store: Store, rowId: string): ContentAcquisitionFrameRecord | null => {
  if (!store.hasRow(SCANNED_CONTENT_TABLE, rowId)) {
    console.log('getContentFrameForRowId: Row id does not exist:', rowId);
    return null;
  }
  const rowData = store.getRow(SCANNED_CONTENT_TABLE, rowId);
  return ContentAcquisitionFrameRecordSchema.parse(rowData);
};


export const getNumFramesReadForStreamId = (store: Store, streamId: TxStreamId): number => {
  const contentFrameRowIds = store.getRowIds(SCANNED_CONTENT_TABLE);
  const contentFrameRows = contentFrameRowIds.map(rowId => getContentFrameForRowId(store, rowId));
  const contentFrameRowsForStreamId = contentFrameRows.filter(row => row?.txStreamId === streamId);

  return contentFrameRowsForStreamId.length;
};


export const getExpectedTotalFrameCountForStreamId = (store: Store, streamId: TxStreamId): number | null => {
  if (!store.hasRow(CONTENT_STREAMS_TABLE, streamId)) {
    console.log('getExpectedTotalFrameCountForStreamId: Row id does not exist:', streamId);
    return null;
  }

  const rowData = store.getRow(CONTENT_STREAMS_TABLE, streamId);
  if (!rowData) {
    console.log('getExpectedTotalFrameCountForStreamId: Row id does not exist:', streamId);
    return null;
  }

  const contentStream = ContentAcquisitionStreamRecordSchema.parse(rowData);
  return contentStream.totalFrameCount;
};


export const getStreamForRowId = (store: Store, rowId: string): ContentAcquisitionStreamRecord | null => {
  if (!store.hasRow(CONTENT_STREAMS_TABLE, rowId)) {
    console.log('getStreamForRowId: Row id does not exist:', rowId);
    return null;
  }
  const rowData = store.getRow(CONTENT_STREAMS_TABLE, rowId);
  return ContentAcquisitionStreamRecordSchema.parse(rowData);
};

export const getStreamById = (store: Store, streamId: TxStreamId): ContentAcquisitionStreamRecord | null => {
  return getStreamForRowId(store, streamId);
};


export const getAllStreams = (store: Store): Promise<ContentAcquisitionStreamRecord[]> => {
  const streamRowIds = store.getRowIds(CONTENT_STREAMS_TABLE);
  const streamRows = streamRowIds.map(rowId => getStreamForRowId(store, rowId)).filter(row => row !== null);
  return Promise.resolve(streamRows);
};


export const getFrameRowIdsForStreamId = (store: Store, streamId: TxStreamId): string[] => {
  const contentFrameRowIds = store.getRowIds(SCANNED_CONTENT_TABLE);
  const contentFrameRowsIdsForStream = contentFrameRowIds.map(rowId =>  {
      const contentFrame = getContentFrameForRowId(store, rowId);
      if (contentFrame?.txStreamId === streamId) {
        return rowId;
      }
      return null;
    }).filter(rowId => rowId !== null);
    
  return contentFrameRowsIdsForStream;
};


export const getFramesForStreamId = (store: Store, streamId: TxStreamId): ContentAcquisitionFrameRecord[] => {
  const contentFrameRowIds = store.getRowIds(SCANNED_CONTENT_TABLE);
  const contentFrameRows = contentFrameRowIds.map(rowId => getContentFrameForRowId(store, rowId));
  const contentFrameRowsForStreamId = contentFrameRows
    .filter(row => row?.txStreamId === streamId)
    .sort((a, b) => a!.contentIndex - b!.contentIndex);
  
  return contentFrameRowsForStreamId as ContentAcquisitionFrameRecord[];
};


export const getFramesWithUnrecognizedStreams = async (store: Store): Promise<ContentAcquisitionFrameRecord[]> => {

  const knownStreams = await getAllStreams(store);
  const knownStreamIds = knownStreams.map(stream => stream.txStreamId);

  const contentFrameRowIds = store.getRowIds(SCANNED_CONTENT_TABLE);
  console.log('getFramesWithUnrecognizedStreams: Content frame row ids:', contentFrameRowIds);

  const contentFrameRows = contentFrameRowIds.map(rowId => getContentFrameForRowId(store, rowId));
  const contentFrameRowsForUnrecognizedStreams = contentFrameRows.filter(row => 
    row?.txStreamId && !knownStreamIds.includes(row.txStreamId));

  console.log('getFramesWithUnrecognizedStreams: Content frame rows for unrecognized streams:', contentFrameRowsForUnrecognizedStreams);

  const contentFramesForUnrecognizedStreams = contentFrameRowsForUnrecognizedStreams
    .map(row => ContentAcquisitionFrameRecordSchema.parse(row));

  return contentFramesForUnrecognizedStreams as ContentAcquisitionFrameRecord[];
};


export const deleteStream = async (store: Store, streamId: TxStreamId) => {
  const streamFrameRowIds = getFrameRowIdsForStreamId(store, streamId);
  streamFrameRowIds.forEach(frameRowId => {
    store.delRow(SCANNED_CONTENT_TABLE, frameRowId);
  });
  store.delRow(CONTENT_STREAMS_TABLE, streamId);
};