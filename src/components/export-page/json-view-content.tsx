import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { QrDataFrame } from '@/protobufs/protofiles-out/qr-io';
import { FrameContentPlaybackControls } from './FrameContentPlaybackControls';
import JSONTree from 'react-native-json-tree';


interface JsonViewContentProps {
  frames: QrDataFrame[];
  framesPerSecond: number;
  activeFrameIndex: number;
  onPreviousFrame: () => void;
  onNextFrame: () => void;
  isAutoplaying: boolean;
  startAutoplay: () => void;
  stopAutoplay: () => void;
}

export const JsonViewContent = ({
  frames,
  framesPerSecond,
  activeFrameIndex,
  onPreviousFrame,
  onNextFrame,
  isAutoplaying,
  startAutoplay,
  stopAutoplay,
}: JsonViewContentProps) => {

  const activeFrame = frames[activeFrameIndex];

  // Convert protobuf frame to a generic object using JSON serialization
  const frameToObject = (frame: QrDataFrame): any => {
    try {
      // Use protobuf's built-in JSON serialization
      const jsonString = QrDataFrame.toJsonString(frame);
      const jsonObject = JSON.parse(jsonString);
      
      // Process the object to handle special cases
      const processObject = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
        
        if (Array.isArray(obj)) {
          return obj.map(processObject);
        }
        
        if (typeof obj === 'object') {
          const processed: any = {};
          for (const [key, value] of Object.entries(obj)) {
            // Handle Uint8Array (bytes) fields - these come as base64 strings from JSON
            if (typeof value === 'string' && key.includes('Content') && value.length > 100) {
              // Likely a base64 encoded bytes field
              processed[key] = `[Base64: ${Math.round(value.length * 0.75)} bytes]`;
            } else {
              processed[key] = processObject(value);
            }
          }
          return processed;
        }
        
        return obj;
      };
      
      return processObject(jsonObject);
    } catch (error) {
      // Fallback to basic frame info if conversion fails
      return {
        frameType: frame.frame.oneofKind,
        error: 'Failed to convert frame data',
        rawFrame: 'See debug view for details'
      };
    }
  };

  return (
    <View style={styles.container}>
      {/* Frame Counter with Side Navigation */}
      {/* <View style={styles.frameCounterContainer}>
        <TouchableOpacity
          style={styles.sideNavButton}
          onPress={handlePreviousFrame}
        >
          <Text style={styles.sideNavButtonText}>
            ←
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.frameCounter}>
          Frame {activeFrameIndex + 1} of {frames.length}
        </Text>
        
        <TouchableOpacity
          style={styles.sideNavButton}
          onPress={handleNextFrame}
        >
          <Text style={styles.sideNavButtonText}>
            →
          </Text>
        </TouchableOpacity>
      </View> */}

      <FrameContentPlaybackControls
        frames={frames}
        currentFrameIndex={activeFrameIndex}
        framesPerSecond={framesPerSecond}
        onPreviousFrame={onPreviousFrame}
        onNextFrame={onNextFrame}
        isAutoplaying={isAutoplaying}
        startAutoplay={startAutoplay}
        stopAutoplay={stopAutoplay}
      />

      {/* Frame Type Indicator */}
      {/* <View style={styles.frameTypeContainer}>
        <Text style={styles.frameTypeLabel}>
          Frame Type: <Text style={styles.frameTypeValue}>{activeFrame.frame.oneofKind}</Text>
        </Text>
      </View> */}

      {/* JSON Content Display */}
      <View style={styles.jsonContainer}>
        <View style={styles.jsonHeader}>
          <Text style={styles.jsonTitle}>Frame Data (JSON)</Text>
        </View>
        <ScrollView 
          style={styles.jsonScrollView} 
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.jsonScrollContent}
        >
          <JSONTree 
            data={frameToObject(activeFrame)}
            theme={{
              scheme: 'monokai',
              base00: '#1e1e1e',
              base01: '#383830',
              base02: '#49483e',
              base03: '#75715e',
              base04: '#a59f85',
              base05: '#f8f8f2',
              base06: '#f5f4f1',
              base07: '#f9f8f5',
              base08: '#f92672',
              base09: '#fd971f',
              base0A: '#f4bf75',
              base0B: '#a6e22e',
              base0C: '#a1efe4',
              base0D: '#66d9ef',
              base0E: '#ae81ff',
              base0F: '#cc6633'
            }}
            invertTheme={false}
            hideRoot={false}
            shouldExpandNode={(keyPath, data, level) => {
              // Expand all nodes by default (level 0 = root, level 1 = first level, etc.)
              return level <= 2; // Expand first 3 levels
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  noDataMessage: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  frameCounterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  frameCounter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sideNavButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  sideNavButtonText: {
    color: 'white',
    fontSize: 18,
  },
  frameTypeContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  frameTypeLabel: {
    fontSize: 14,
    color: '#666',
  },
  frameTypeValue: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  jsonContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jsonHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    backgroundColor: '#f8f9fa',
  },
  jsonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  jsonScrollView: {
    maxHeight: 500,
    backgroundColor: '#1e1e1e',
  },
  jsonScrollContent: {
    padding: 16,
  },
});
