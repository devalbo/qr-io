import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/contexts/AppContext';
import { QrIoTbStoreProvider } from '@/src/contexts/QrIoStorageContext';
import { FileIntentProvider } from '../src/contexts/FileIntentContext';
import { useFileIntentHandler } from '../src/hooks/useFileIntentHandler';
import { StatusBar } from 'expo-status-bar';

const AppContent = () => {
  const { sharedFile, isProcessing, clearSharedFile } = useFileIntentHandler();

  return (
    <FileIntentProvider 
      sharedFile={sharedFile} 
      isProcessing={isProcessing} 
      clearSharedFile={clearSharedFile}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </FileIntentProvider>
  );
};

export default function RootLayout() {
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
