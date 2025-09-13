import { View, Text, StyleSheet } from "react-native"
import Slider from '@react-native-community/slider';
import { AppSettings } from "../../zod-types/app-settings";


interface QrTxSettingsSectionProps {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
}

export const QrTxSettingsSection = ({ settings, updateSettings }: QrTxSettingsSectionProps) => {

  const handleQrTransmissionRateChange = (rate: number) => {
    updateSettings({ ...settings, qrTransmissionRate: rate });
  };

  const handleMaxBytesPerQrCodeChange = (maxBytes: number) => {
    updateSettings({ ...settings, maxBytesPerQrCode: maxBytes });
  };


  const renderSettingItem = (
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.settingAction}>{rightElement}</View>}
    </View>
  );


  return (
    <View>
      <Text style={styles.sectionTitle}>QR Transmission Settings</Text>
      {renderSettingItem(
        'Max Transmission Rate',
        `${settings.qrTransmissionRate} frames per second`,
        <View style={styles.sliderContainer}>
          <Slider
            value={settings.qrTransmissionRate}
            minimumValue={1}
            maximumValue={100}
            onValueChange={handleQrTransmissionRateChange}
            step={1}
            style={styles.slider}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#fff"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1 fps</Text>
            <Text style={styles.sliderLabel}>100 fps</Text>
          </View>
        </View>
      )}
      {renderSettingItem(
        'Max bytes per QR Code',
        `${settings.maxBytesPerQrCode} bytes`,
        <View style={styles.sliderContainer}>
          <Slider
            value={settings.maxBytesPerQrCode}
            minimumValue={5}
            maximumValue={2000}
            onValueChange={handleMaxBytesPerQrCodeChange}
            step={5}
            style={styles.slider}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#fff"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>5 bytes</Text>
            <Text style={styles.sliderLabel}>2000 bytes</Text>
          </View>
        </View>
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
