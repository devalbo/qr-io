import { createStore } from "tinybase/store";
import { TB_STORE_TABLES_SCHEMA } from "../qrio-backend-types";


export const createQrIoStore = () => {
  
  const store = createStore()
    .setTablesSchema(TB_STORE_TABLES_SCHEMA);

    // Add some test data for the inspector
    // .setTable(SCANNED_CONTENT_TABLE, {
    //   '1': {
    //     contentHash: 'test-hash-1',
    //     frameIndex: 0,
    //     frameLength: 3,
    //     contentBytes: JSON.stringify([1, 2, 3, 4, 5]),
    //     createdAt: new Date().toISOString(),
    //   },
    //   '2': {
    //     contentHash: 'test-hash-1',
    //     frameIndex: 1,
    //     frameLength: 3,
    //     contentBytes: JSON.stringify([6, 7, 8, 9, 10]),
    //     createdAt: new Date().toISOString(),
    //   },
    // })
    // .setTable(CONTENT_STREAM_TABLE, {
    //   '1': {
    //     txMetadataId: 'meta-1',
    //     contentName: 'Test Document.pdf',
    //     contentHash: 'test-hash-1',
    //     contentLength: 3,
    //     mimeType: 'application/pdf',
    //     hashAlgorithm: 'sha256',
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //   },
    // });
  return store;
};
