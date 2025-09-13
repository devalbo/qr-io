import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ContentFormatType, ContentFormatOption } from '@/src/types/content-format';

interface TabControlProps {
  options: ContentFormatOption[];
  selectedValue: ContentFormatType;
  onValueChange: (value: ContentFormatType) => void;
}

export const TabControl = ({ options, selectedValue, onValueChange }: TabControlProps) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.tab,
            selectedValue === option.value && styles.activeTab
          ]}
          onPress={() => onValueChange(option.value)}
        >
          <Text style={[
            styles.tabText,
            selectedValue === option.value && styles.activeTabText
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    marginVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});
