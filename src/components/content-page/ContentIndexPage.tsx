import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../contexts/AppContext';


interface ContentTabProps {}

export const ContentIndexPage = ({ }: ContentTabProps) => {
  const router = useRouter();
  const { settings } = useApp();


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Management</Text>
        <Text style={styles.subtitle}>
          Manage your QR streams and data
        </Text>
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => router.push('/content/streams')}
        >
          <Text style={styles.navigationIcon}>📊</Text>
          <Text style={styles.navigationTitle}>Streams</Text>
          <Text style={styles.navigationDescription}>
            View and manage your QR data streams
          </Text>
        </TouchableOpacity>

        {settings.debugMode && (
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/content/frames')}
          >
            <Text style={styles.navigationIcon}>🖼️</Text>
            <Text style={styles.navigationTitle}>Orphaned Frames</Text>
            <Text style={styles.navigationDescription}>
              Inspect individual QR code frames without recognized streams
            </Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity 
          style={styles.navigationButton}
          onPress={() => router.push('/content/data-management')}
        >
          <Text style={styles.navigationIcon}>📂</Text>
          <Text style={styles.navigationTitle}>Data Management</Text>
          <Text style={styles.navigationDescription}>
            Manage your stored data and settings
          </Text>
        </TouchableOpacity> */}
      </View>
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
  navigationContainer: {
    padding: 16,
    gap: 16,
  },
  navigationButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  navigationIcon: {
    fontSize: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
  navigationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  navigationDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
