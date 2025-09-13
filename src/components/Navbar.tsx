import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TAB_CONFIGS } from '../constants/tabs';

interface NavbarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

export const Navbar = ({ activeTab, onTabPress }: NavbarProps) => {
  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>QR-IO</Text>
        </View>
        <View style={styles.tabs}>
          {TAB_CONFIGS.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tab,
                activeTab === tab.name && styles.activeTab
              ]}
              onPress={() => onTabPress(tab.name)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabText,
                activeTab === tab.name && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
});
