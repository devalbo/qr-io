import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions
} from 'react-native';
import { QrDataFrame } from "@/protobufs/protofiles-out/qr-io";
import { getFrameDataTransferBlob } from "@/src/utils/qrdata-utils";
import { FrameAnalyzerHeaderDetails } from './FrameAnalyzerHeaderDetails';
import { FrameAnalyzerContentDetails } from './FrameAnalyzerContentDetails';
import { FrameAnalyzerFrameDetails } from './FrameAnalyzerFrameDetails';

interface LatestFrameAnalyzerProps {
  latestFrame: QrDataFrame | undefined;
  isVisible?: boolean;
}

export const LatestFrameAnalyzer = ({ 
  latestFrame,
  isVisible = true
}: LatestFrameAnalyzerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const latestFrameData = getFrameDataTransferBlob(latestFrame);
  const hasFrame = latestFrame !== undefined;

  const toggleExpansion = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const getExpansionStyle = () => {
    const { width: screenWidth } = Dimensions.get('window');
    const collapsedSize = 60;
    const expandedWidth = screenWidth * 0.85; // Take 85% of screen width
    const expandedHeight = 350; // Increased height for header details without sections
    
    return {
      width: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [collapsedSize, expandedWidth],
      }),
      height: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [collapsedSize, expandedHeight],
      }),
      alignSelf: 'center' as const,
    };
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.outerContainer}>
      <Animated.View style={[styles.container, getExpansionStyle()]}>
        <TouchableOpacity 
          style={styles.button}
          onPress={toggleExpansion}
          activeOpacity={0.8}
        >
        {!isExpanded ? (
          <View style={[styles.collapsedContent, hasFrame ? styles.collapsedActive : null]}>
            <Text style={[styles.collapsedText, hasFrame ? styles.collapsedActiveText : null]}>
              {hasFrame ? '📊' : '📊'}
            </Text>
          </View>
        ) : (
          <View style={styles.expandedContent}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Latest Frame
              </Text>
            </View>
            
            <View style={styles.frameInfoSection}>
              <FrameAnalyzerFrameDetails frame={latestFrame} />

{/* 
                (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Frame Type:</Text>
                    <Text style={styles.infoValue}>{latestFrame?.frame.oneofKind || 'Unknown'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Data Type:</Text>
                    <Text style={styles.infoValue}>{latestFrameData?.content.oneofKind || 'Unknown'}</Text>
                  </View>
                  
                  {latestFrameData?.content.oneofKind === 'textContent' && (
                    <View style={styles.contentSection}>
                      <Text style={styles.contentLabel}>Text Content:</Text>
                      <Text style={styles.contentText} numberOfLines={3}>
                        {latestFrameData.content.textContent}
                      </Text>
                    </View>
                  )}
                  
                  {latestFrameData?.content.oneofKind === 'bytesContent' && (
                    <View style={styles.contentSection}>
                      <Text style={styles.contentLabel}>Bytes Content:</Text>
                      <Text style={styles.contentText} numberOfLines={2}>
                        {latestFrameData.content.bytesContent ? 
                          `${latestFrameData.content.bytesContent.length} bytes` : 
                          'No data'
                        }
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.noFrameContainer}>
                  <Text style={styles.noFrameText}>No frame data available</Text>
                  <Text style={styles.noFrameSubtext}>Scan a QR code to see frame details</Text>
                </View>
              )} */}
            </View>
          </View>
        )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    // Remove zIndex from here since it's on outerContainer
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
