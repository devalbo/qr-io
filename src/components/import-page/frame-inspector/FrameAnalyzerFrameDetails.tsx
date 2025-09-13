import { View, Text, StyleSheet } from "react-native";
import { QrDataFrame } from "@/protobufs/protofiles-out/qr-io";
import { FrameAnalyzerContentDetails } from "./FrameAnalyzerContentDetails";
import { FrameAnalyzerHeaderDetails } from "./FrameAnalyzerHeaderDetails";


interface FrameAnalyzerFrameDetailsProps {
  frame?: QrDataFrame;
}

export const FrameAnalyzerFrameDetails = ({ frame }: FrameAnalyzerFrameDetailsProps) => {

  if (frame?.frame.oneofKind === 'header') {
    return <FrameAnalyzerHeaderDetails header={frame.frame.header} />
  }

  if (frame?.frame.oneofKind === 'contentTx') {
    return <FrameAnalyzerContentDetails content={frame.frame.contentTx} />
  }

  return (
    <View>
      <Text>No Frame Analyzer Frame Details</Text>
      <Text style={styles.noFrameText}>No frame data available</Text>
      <Text style={styles.noFrameSubtext}>Scan a QR code to see frame details</Text>

    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  collapsedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  collapsedActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  collapsedActiveText: {
    fontSize: 24,
  },
  expandedContent: {
    flex: 1,
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  frameInfoSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  infoValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
  contentSection: {
    marginTop: 8,
  },
  contentLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentText: {
    color: '#FFD700',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  noFrameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noFrameText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  noFrameSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
});
