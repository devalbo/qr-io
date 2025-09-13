import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet} from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { useQrIoTbStore } from '../../contexts/QrIoStorageContext';
import { GenericTabControl } from '../GenericTabControl';
import { ManageStorageSection } from './manage-storage-section';
import { AboutSection } from './about-section';
import { AdvancedSettingsView } from './advanced-settings-section';

type SettingsSection = 'storage' | 'about' | 'advanced';

const SETTINGS_SECTIONS = [
  { value: 'about' as SettingsSection, label: 'About', icon: 'ℹ️' },
  { value: 'storage' as SettingsSection, label: 'Storage', icon: '💾' },
  { value: 'advanced' as SettingsSection, label: 'Advanced', icon: '🔧' },
];

export const SettingsPage = () => {
  const { settings, updateSettings } = useApp();
  const { queryApi } = useQrIoTbStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('about');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'storage':
        return (
          <View style={styles.section}>
            <ManageStorageSection
              updateSettings={updateSettings}
              queryApi={queryApi}
            />
          </View>
        );
      case 'about':
        return (
          <View style={styles.section}>
            <AboutSection />
          </View>
        );
      case 'advanced':
        return (
          <View style={styles.section}>
            <AdvancedSettingsView
              settings={settings}
              updateSettings={updateSettings}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Configure your app preferences and data management
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <GenericTabControl
          options={SETTINGS_SECTIONS}
          selectedValue={activeSection}
          onValueChange={setActiveSection}
        />
      </View>

      {renderActiveSection()}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
