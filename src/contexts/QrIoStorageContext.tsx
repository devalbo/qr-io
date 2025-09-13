import { createContext, useContext, useEffect, useState } from "react";
import { createQrIoStore } from "./storage/tb-init";
import { ActivityIndicator, Platform, View, Text, StyleSheet } from 'react-native';
import { CONTENT_STREAMS_TABLE, IQrIoTbData, IQrIoTbStoreContextType, IQrIoTbStoreProviderProps, IQrIoTbStoreQueryApi, SCANNED_CONTENT_TABLE } from "./qrio-backend-types";
import { useCreatePersister, useCreateStore, useRowCountListener, useRowListener } from "tinybase/ui-react";
import { getAllStreams, getExpectedTotalFrameCountForStreamId, getNumFramesReadForStreamId, getFramesForStreamId, resetStore, getFramesWithUnrecognizedStreams, getStreamById, deleteStream } from "./storage/tb-query";
import { ContentAcquisitionStreamRecord, TxStreamId } from "../types/database";
import { setAppSettings, getAppSettings } from "./storage/tb-settings";
import { AppSettings } from "../zod-types/app-settings";
import { createPlatformPersister } from "./platform-persister";


const QrIoTbStoreContext = createContext<IQrIoTbStoreContextType | null>(null);

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

// // Helper function to create the appropriate persister based on platform
// const createPlatformPersister = async (store: any) => {
//   console.log("Creating platform persister for platform:", Platform.OS);
  
//   if (Platform.OS === 'web') {
//     // Use browser persister for web
//     console.log("Creating browser persister...");
//     try {
//       const persister = createLocalPersister(store, 'qr-io');
//       console.log("Browser persister created successfully");
//       return persister;
//     } catch (error) {
//       console.error('Failed to create browser persister:', error);
//       throw error;
//     }
//   } else {
//     // Use SQLite persister for native platforms
//     // Use eval to prevent bundler from trying to resolve these modules at build time
//     try {
//       const sqliteModule = eval('require("expo-sqlite")');
//       const persisterModule = eval('require("tinybase/persisters/persister-expo-sqlite")');
      
//       console.log("OPENING DB");
//       const db = sqliteModule.openDatabaseSync('qr-io.db');
//       console.log("DB CREATED");

//       const persister = persisterModule.createExpoSqlitePersister(store, db, "qr-io");
//       return persister;
//     } catch (error) {
//       console.error('Failed to load SQLite persister:', error);
//       // Fallback to browser persister if SQLite fails
//       const persister = createLocalPersister(store, 'qr-io');
//       return persister;
//     }
//   }
// };


const StoreLoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Initializing QRIO store...</Text>
  </View>
);


export const QrIoTbStoreProvider = ({ children }: IQrIoTbStoreProviderProps) => {

  console.log("STORE CONTEXT - Starting provider");
  
  const store = useCreateStore(() => {
    console.log("Creating store with createQrIoStore");
    return createQrIoStore();
  });
  
  console.log("Store created:", store);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [allStreams, setAllStreams] = useState<ContentAcquisitionStreamRecord[]>([]);

  console.log("STORE CONTEXT - Provider initialized");

  // Add a timeout fallback to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn("Store initialization timeout - forcing initialization");
        setIsInitialized(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [isInitialized]);

  // Temporarily disable persister to get the app working
  useEffect(() => {
    console.log("Initializing store without persister for now");
    setIsInitialized(true);
  }, []);

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


