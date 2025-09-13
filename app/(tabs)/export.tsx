import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDeviceInfo } from '../../src/hooks/useDeviceInfo';
import { ExportPage } from '../../src/components/export-page/ExportPage';
import { Navbar } from '../../src/components/Navbar';
import { useTabNavigation } from '../../src/utils/navigation';

export const ExportTab = () => {
  const { shouldUseBottomTabs } = useDeviceInfo();
  const { navigateToTab } = useTabNavigation();

  const handleTabPress = (tabName: string) => {
    navigateToTab(tabName);
  };

  if (shouldUseBottomTabs) {
    // Bottom tabs for phone/tablet portrait
    return <ExportPage />;
  }

  // Navbar for desktop/landscape
  return (
    <View style={styles.container}>
      <Navbar 
        activeTab="Export" 
        onTabPress={handleTabPress} 
      />
      <View style={styles.content}>
        <ExportPage />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default ExportTab;
