import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface InspectFramesSectionProps {
  handleFrameInspector: () => void;
}


export const InspectFramesSection = ({ handleFrameInspector }: InspectFramesSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📱 Frame Scan</Text>
      <Text style={styles.sectionDescription}>
        Scan individual QR code frames and view their data immediately. Perfect for testing and debugging.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleFrameInspector}
      >
        <Text style={styles.buttonText}>
          Open Frame Inspector
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.scannerInfoText}>
        Scan individual QR code frames and view their data immediately
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginBottom: 16,
  },
  ioSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scannerInfoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
