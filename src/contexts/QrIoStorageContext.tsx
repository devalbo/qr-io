import { createContext, useContext, useEffect, useState } from "react";
import { createQrIoStore } from "./storage/tb-init";
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { CONTENT_STREAMS_TABLE, IQrIoTbData, IQrIoTbStoreContextType, IQrIoTbStoreProviderProps, IQrIoTbStoreQueryApi } from "./qrio-backend-types";
import { useCreateStore, useRowCountListener } from "tinybase/ui-react";
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



const StoreLoadingFallback = ({ initializationTimedOut }: { initializationTimedOut: boolean }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Initializing QRIO store...</Text>
    {initializationTimedOut && <Text style={styles.loadingText}>Initialization timed out</Text>}
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
  const [initializationTimedOut, setInitializationTimedOut] = useState(false);
  const [allStreams, setAllStreams] = useState<ContentAcquisitionStreamRecord[]>([]);

  console.log("STORE CONTEXT - Provider initializing");

  // Add a timeout fallback to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn("Store initialization timeout - forcing initialization");
        setInitializationTimedOut(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [isInitialized]);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        console.log("Initializing store with persister...");
        
        // Create and start the persister
        const persister = await createPlatformPersister(store);
        await persister.startAutoLoad();
        await persister.startAutoSave();
        
        console.log("Store persister initialized successfully");
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize store persister:', error);
        // Still initialize the store even if persister fails
        console.log("Initializing store without persister due to error");
        setIsInitialized(true);
      }
    };

    initializeStore();
  }, [store]);

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
    return <StoreLoadingFallback
      initializationTimedOut={initializationTimedOut}
    />;
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


