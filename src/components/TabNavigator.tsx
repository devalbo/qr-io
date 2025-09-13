import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { ImportPage } from './import-page/ImportPage';
import { ExportPage } from './export-page/ExportPage';
import { ContentIndexPage } from './content-page/ContentIndexPage';
import { SettingsPage } from './settings-page/SettingsPage';
import { Navbar } from './Navbar';
import { useDeviceInfo } from '../hooks/useDeviceInfo';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { shouldUseBottomTabs } = useDeviceInfo();
  const [activeTab, setActiveTab] = useState('Import');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Import':
        return <ImportPage />;
      case 'Export':
        return <ExportPage />;
      case 'Content':
        return <ContentIndexPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <ImportPage />;
    }
  };

  if (shouldUseBottomTabs) {
    // Bottom tabs for phone/tablet portrait
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              paddingBottom: 8,
              paddingTop: 8,
              height: 88,
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginTop: 4,
            },
          }}
        >
          <Tab.Screen
            name="Import"
            component={ImportPage}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 24, color }}>📥</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Export"
            component={ExportPage}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 24, color }}>📤</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Content"
            component={ContentIndexPage}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 24, color }}>📋</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsPage}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 24, color }}>⚙️</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }

  // Navbar for desktop/landscape
  return (
    <View style={styles.container}>
      <Navbar 
        activeTab={activeTab} 
        onTabPress={setActiveTab} 
      />
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
};

TabNavigator.displayName = 'TabNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
