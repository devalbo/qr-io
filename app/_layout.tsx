import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/contexts/AppContext';
import { QrIoTbStoreProvider } from '@/src/contexts/QrIoStorageContext';
import { FileIntentProvider } from '../src/contexts/FileIntentContext';
import { useFileIntentHandler } from '../src/hooks/useFileIntentHandler';
import { StatusBar } from 'expo-status-bar';

const AppContent = () => {
  console.log("APP CONTENT - Starting");
  
  // Temporarily disable file intent handler to isolate the issue
  // const { sharedFile, isProcessing, clearSharedFile } = useFileIntentHandler();
  // console.log("APP CONTENT - File intent handler loaded");

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
    // <FileIntentProvider 
    //   sharedFile={sharedFile} 
    //   isProcessing={isProcessing} 
    //   clearSharedFile={clearSharedFile}
    // >
    //   <Stack
    //     screenOptions={{
    //       headerShown: false,
    //     }}
    //   >
    //     <Stack.Screen name="(tabs)" />
    //   </Stack>
    //   <StatusBar style="auto" />
    // </FileIntentProvider>
  );
};

export default function RootLayout() {
  console.log("ROOT LAYOUT - Starting");
  
  return (
    <SafeAreaProvider>
      <QrIoTbStoreProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </QrIoTbStoreProvider>
    </SafeAreaProvider>
  );
}
