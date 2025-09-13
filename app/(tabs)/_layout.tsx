import React from 'react';
import { Tabs } from 'expo-router';
import { useDeviceInfo } from '../../src/hooks/useDeviceInfo';
import { Text } from 'react-native';

export default function TabsLayout() {
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
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
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
}
