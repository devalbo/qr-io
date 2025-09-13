import React from 'react';
import { View, Text, StyleSheet, Switch, Platform } from 'react-native';
import { AppSettings } from '../../zod-types/app-settings';
import { Provider } from 'tinybase/ui-react';
import { Inspector } from 'tinybase/ui-react-inspector';
import { useQrIoTbStore } from '@/src/contexts/QrIoStorageContext';
import { QrTxSettingsSection } from './qr-tx-settings-section';

interface AdvancedSettingsSectionProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const AdvancedSettingsView = ({ 
  settings, 
  updateSettings 
}: AdvancedSettingsSectionProps) => {

  const { store } = useQrIoTbStore();

  const handleDebugModeToggle = (value: boolean) => {
    updateSettings({ debugMode: value });
  };

  const handleShowInspectorToggle = (value: boolean) => {
    updateSettings({ showInspector: value });
  };

  return (
    <View style={styles.container}>
      {
        settings.showInspector && (
          Platform.OS === 'web' && (
            <Provider store={store}>
              <Inspector />
            </Provider>
            )
          )
      }

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Options</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Debug Mode</Text>
            <Text style={styles.settingDescription}>
              Enable debug mode to show additional logging and development information
            </Text>
          </View>
          <Switch
            value={settings.debugMode}
            onValueChange={handleDebugModeToggle}
            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
            thumbColor={settings.debugMode ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        </View>

        {Platform.OS === 'web' && (
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Show Inspector</Text>
              <Text style={styles.settingDescription}>
                Enable to show the inspector for the TinyBase store
              </Text>
            </View>
            <Switch
              value={settings.showInspector}
              onValueChange={handleShowInspectorToggle}
              trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
              thumbColor={settings.showInspector ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <QrTxSettingsSection
          settings={settings}
          updateSettings={updateSettings}
        />
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Development</Text>
        <Text style={styles.infoText}>
          Debug mode provides additional logging and development tools to help with troubleshooting and development.
        </Text>
        {settings.debugMode && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              🐛 Debug mode is currently enabled
            </Text>
          </View>
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  debugInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  debugText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});
