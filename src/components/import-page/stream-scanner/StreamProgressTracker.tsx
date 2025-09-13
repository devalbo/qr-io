import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { TxStreamId } from '@/src/types/database';

export type ExpansionCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface StreamProgressTrackerProps {
  streamId: TxStreamId | null;
  streamName?: string;
  framesRead: number;
  expectedFrames: number | null;
  expansionCorner?: ExpansionCorner;
  isVisible?: boolean;
}

export const StreamProgressTracker = ({ 
  streamId,
  streamName,
  framesRead,
  expectedFrames,
  expansionCorner = 'bottom-right',
  isVisible = true
}: StreamProgressTrackerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const router = useRouter();

  const percentComplete = expectedFrames && expectedFrames > 0 ? Math.round((framesRead / expectedFrames) * 100) : 0;
  const isComplete = percentComplete >= 100 && expectedFrames && framesRead >= expectedFrames;

  const handleViewStream = () => {
    if (streamId) {
      router.push('/content');
      router.push(`/content/streams/${streamId}`);
    }
  };

  const toggleExpansion = () => {
    if (isComplete && !isExpanded) {
      // If complete and collapsed, navigate to stream
      handleViewStream();
      return;
    }
    
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
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const collapsedSize = 60;
    const expandedWidth = 280;
    const expandedHeight = 120;
    
    const baseStyle = {
      position: 'absolute' as const,
      width: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [collapsedSize, expandedWidth],
      }),
      height: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [collapsedSize, expandedHeight],
      }),
    };

    switch (expansionCorner) {
      case 'top-left':
        return {
          ...baseStyle,
          top: 20,
          left: 20,
        };
      case 'top-right':
        return {
          ...baseStyle,
          top: 20,
          right: 20,
        };
      case 'bottom-left':
        return {
          ...baseStyle,
          bottom: 20,
          left: 20,
        };
      case 'bottom-right':
      default:
        return {
          ...baseStyle,
          bottom: 20,
          right: 20,
        };
    }
  };

  // Debug logging
  console.log('StreamProgressTracker Debug:', {
    isVisible,
    streamId,
    framesRead,
    expectedFrames,
    percentComplete,
    expansionCorner
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, getExpansionStyle()]}>
      <TouchableOpacity 
        style={styles.button}
        onPress={toggleExpansion}
        activeOpacity={0.8}
      >
        {!isExpanded ? (
          <View style={[styles.collapsedContent, isComplete ? styles.collapsedComplete : null]}>
            <Text style={[styles.collapsedText, isComplete ? styles.collapsedCompleteText : null]}>
              {isComplete ? '→' : (streamId ? `${percentComplete}%` : 'Details')}
            </Text>
          </View>
        ) : (
          <View style={styles.expandedContent}>
            <View style={styles.header}>
              <Text style={styles.streamTitle}>
                {streamId ? (streamName || `Stream: ${streamId.slice(0, 8)}...`) : 'No Active Stream'}
              </Text>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Frames Read:</Text>
                <Text style={styles.progressValue}>{framesRead}</Text>
              </View>
              
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Expected:</Text>
                <Text style={styles.progressValue}>
                  {expectedFrames !== null ? expectedFrames : 'Unknown'}
                </Text>
              </View>
              
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Complete:</Text>
                <Text style={[styles.progressValue, styles.percentText]}>
                  {percentComplete}%
                </Text>
              </View>
            </View>
            
            {isComplete ? (
              <TouchableOpacity 
                style={styles.completionContainer}
                onPress={handleViewStream}
                activeOpacity={0.8}
              >
                <View style={styles.completionRectangle}>
                  <Text style={styles.completionText}>Complete →</Text>
                  <Text style={styles.viewStreamText}>
                    {streamName || (streamId ? `Stream: ${streamId.slice(0, 8)}...` : 'View Stream')}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${percentComplete}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  collapsedComplete: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  collapsedCompleteText: {
    fontSize: 20,
  },
  expandedContent: {
    flex: 1,
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  streamTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  progressValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  percentText: {
    color: '#FFD700',
    fontSize: 14,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  completionContainer: {
    marginTop: 8,
  },
  completionRectangle: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  completionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  viewStreamText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
