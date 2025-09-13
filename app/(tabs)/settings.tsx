import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDeviceInfo } from '../../src/hooks/useDeviceInfo';
import { SettingsPage } from '../../src/components/settings-page/SettingsPage';
import { Navbar } from '../../src/components/Navbar';
import { useTabNavigation } from '../../src/utils/navigation';

export const SettingsTab = () => {
  const { shouldUseBottomTabs } = useDeviceInfo();
  const { navigateToTab } = useTabNavigation();

  const handleTabPress = (tabName: string) => {
    navigateToTab(tabName);
  };

  if (shouldUseBottomTabs) {
    // Bottom tabs for phone/tablet portrait
    return <SettingsPage />;
  }

  // Navbar for desktop/landscape
  return (
    <View style={styles.container}>
      <Navbar 
        activeTab="Settings" 
        onTabPress={handleTabPress} 
      />
      <View style={styles.content}>
        <SettingsPage />
      </View>
    </View>
  );
}

export default SettingsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
