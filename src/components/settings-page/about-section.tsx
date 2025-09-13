import { View, Text, StyleSheet } from "react-native"
import { useBuildInfo } from "../../hooks/useBuildInfo"

export const AboutSection = () => {
  const { buildInfo, loading, error } = useBuildInfo();

  if (loading) {
    return (
      <View>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.loadingText}>Loading build info...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Build Date:</Text>
        <Text style={styles.aboutValue}>{buildInfo?.buildDate || 'Unknown'}</Text>
      </View>
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Git Hash:</Text>
        <Text style={styles.aboutValue}>{buildInfo?.gitShortHash || 'Unknown'}</Text>
      </View>
      {error && (
        <Text style={styles.errorText}>Note: Build info unavailable ({error})</Text>
      )}
    </View>
  )
}


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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingAction: {
    marginLeft: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  themeOptionActive: {
    backgroundColor: '#007AFF',
  },
  themeOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  themeOptionTextActive: {
    color: '#fff',
  },
  languageSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  languageOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  languageOptionActive: {
    backgroundColor: '#007AFF',
  },
  languageOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  languageOptionTextActive: {
    color: '#fff',
  },
  retentionSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  retentionOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  retentionOptionActive: {
    backgroundColor: '#007AFF',
  },
  retentionOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  retentionOptionTextActive: {
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  dataStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dataStatLabel: {
    fontSize: 16,
    color: '#333',
  },
  dataStatValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#333',
  },
  aboutValue: {
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontStyle: 'italic',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  sliderContainer: {
    width: 200,
  },
  slider: {
    marginBottom: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
});
