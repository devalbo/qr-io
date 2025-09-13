import { createContext, useContext, useEffect, useState } from "react";
import { createQrIoStore } from "./storage/tb-init";
import { ActivityIndicator, Platform, View, Text, StyleSheet } from 'react-native';
import { CONTENT_STREAMS_TABLE, IQrIoTbData, IQrIoTbStoreContextType, IQrIoTbStoreProviderProps, IQrIoTbStoreQueryApi, SCANNED_CONTENT_TABLE } from "./qrio-backend-types";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite";
import { useCreatePersister, useCreateStore, useRowCountListener, useRowListener } from "tinybase/ui-react";
import * as SQLite from 'expo-sqlite';
import { getAllStreams, getExpectedTotalFrameCountForStreamId, getNumFramesReadForStreamId, getFramesForStreamId, resetStore, getFramesWithUnrecognizedStreams, getStreamById, deleteStream } from "./storage/tb-query";
import { ContentAcquisitionStreamRecord, TxStreamId } from "../types/database";
import { setAppSettings, getAppSettings } from "./storage/tb-settings";
import { AppSettings } from "../zod-types/app-settings";


const QrIoTbStoreContext = createContext<IQrIoTbStoreContextType | null>(null);


const StoreLoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Initializing store...</Text>
  </View>
);


export const QrIoTbStoreProvider = ({ children }: IQrIoTbStoreProviderProps) => {

  const store = useCreateStore(() => createQrIoStore());
  const [isInitialized, setIsInitialized] = useState(false);
  const [allStreams, setAllStreams] = useState<ContentAcquisitionStreamRecord[]>([]);

  console.log("STORE CONTEXT");


  useCreatePersister(
    store,
    async (store) => {
      console.log("CREATING STORE");
      if (Platform.OS === 'web') {
        // Use browser persister for web
        const persister = createLocalPersister(store, 'qr-io');
        return persister;
      } else {
        // Use SQLite persister for native platforms
        console.log("OPENING DB");
        const db = SQLite.openDatabaseSync('qr-io.db');
        console.log("DB CREATED");

        const persister = createExpoSqlitePersister(store, db, "qr-io");
        return persister;
      }
    },
    [],
    async (persister) => {
      console.log("CREATING PERSISTER");
      if (persister) {
        console.log('persister', persister);
        try {
          await persister.startAutoLoad([
            {
              [SCANNED_CONTENT_TABLE]: { },
              [CONTENT_STREAMS_TABLE]: { },
            },
            { }
          ]);
          console.log("startAutoLoad done");
          
          await persister.startAutoSave();
          console.log("startAutoSave done");
          setIsInitialized(true);
        } catch (error) {
          console.error('Persister initialization error:', error);
          setIsInitialized(true); // Still mark as initialized to prevent blocking
        }
      }
    }
  );

  useRowCountListener(CONTENT_STREAMS_TABLE, 
    async (_store, tableId, _rowId) => {
      const allStreams = await getAllStreams(store);
      setAllStreams(allStreams);
    }, [], false, store);

  // useRowListener(null, null, 
  //   async (_store, tableId, _rowId) => {
  //     if (tableId === CONTENT_STREAMS_TABLE) {
  //       const allStreams = await getAllStreams(store);
  //       setAllStreams(allStreams);
  //     }
  //   },
  //   [],
  //   false,
  //   store
  // );

  if (!isInitialized) {
    return <StoreLoadingFallback />;
  }

  const queryApi: IQrIoTbStoreQueryApi = {
    resetStore: () => resetStore(store),

    setAppSettings: (settings: AppSettings) => setAppSettings(store, settings),
    getAppSettings: () => getAppSettings(store),
    
    getNumFramesReadForStreamId: (streamId: TxStreamId) => getNumFramesReadForStreamId(store, streamId),
    getExpectedTotalFrameCountForStreamId: (streamId: TxStreamId) => getExpectedTotalFrameCountForStreamId(store, streamId),
    getFramesForStreamId: (streamId: TxStreamId) => getFramesForStreamId(store, streamId),
    getStreamById: (streamId: TxStreamId) => getStreamById(store, streamId),

    getFramesWithUnrecognizedStreams: () => getFramesWithUnrecognizedStreams(store),

    deleteStream: (streamId: TxStreamId) => deleteStream(store, streamId),
  };

  const data: IQrIoTbData = {
    allStreams,
  };

  const value: IQrIoTbStoreContextType = {
    store,
    queryApi,
    data,
  };

  return (
    <QrIoTbStoreContext.Provider value={value}>
      {children}
    </QrIoTbStoreContext.Provider>
  );
};


export const useQrIoTbStore = (): IQrIoTbStoreContextType => {
  const context = useContext(QrIoTbStoreContext);
  if (!context) {
    throw new Error('useQrIoTbStore must be used within a QrIoTbStoreProvider');
  }
  return context;
};


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
