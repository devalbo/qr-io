import React from 'react';
import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../../src/contexts/AppContext';
import { useDeviceInfo } from '../../src/hooks/useDeviceInfo';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QrIoTbStoreProvider } from '@/src/contexts/QrIoStorageContext';
import { FileIntentProvider } from '../../src/contexts/FileIntentContext';
import { useFileIntentHandler } from '../../src/hooks/useFileIntentHandler';


const TabsLayout = () => {
  const { shouldUseBottomTabs } = useDeviceInfo();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: shouldUseBottomTabs ? {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        } : { display: 'none' },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="import"
        options={{
          title: 'Import',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📥</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          title: 'Export',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📤</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: 'Content',
          // headerShown: true,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
};

const AppContent = () => {
  const { sharedFile, isProcessing, clearSharedFile } = useFileIntentHandler();

  return (
    <FileIntentProvider 
      sharedFile={sharedFile} 
      isProcessing={isProcessing} 
      clearSharedFile={clearSharedFile}
    >
      <TabsLayout />
    </FileIntentProvider>
  );
};

export const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <QrIoTbStoreProvider>
        <AppProvider>
          <AppContent />
          <StatusBar style="auto" />
        </AppProvider>
      </QrIoTbStoreProvider>
    </SafeAreaProvider>
  );
}

export default RootLayout;
