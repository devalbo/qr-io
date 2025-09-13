import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { QrDataFrame } from "@/protobufs/protofiles-out/qr-io";


interface FrameContentPlaybackControlsProps {
  frames: QrDataFrame[];
  currentFrameIndex: number;
  framesPerSecond: number;
  onPreviousFrame: () => void;
  onNextFrame: () => void;

  isAutoplaying: boolean;
  startAutoplay: () => void;
  stopAutoplay: () => void;
}

export const FrameContentPlaybackControls = ({
  frames,
  currentFrameIndex,
  framesPerSecond,
  onPreviousFrame,
  onNextFrame,
  isAutoplaying,
  startAutoplay,
  stopAutoplay,
}: FrameContentPlaybackControlsProps) => {
  
  const isAutoplayEnabled = frames.length > 1;

  // Autoplay effect
  useEffect(() => {
    if (!isAutoplaying || frames.length <= 1) {
      return;
    }

    const intervalMs = 1000 / framesPerSecond;
    const interval = setInterval(() => {
      onNextFrame();
    }, intervalMs);

    return () => {
      stopAutoplay();
      clearInterval(interval);
    };
  }, [isAutoplaying, frames.length, framesPerSecond]);

  if (frames.length === 0) {
    return (
      <View style={styles.noDataMessage}>
        <Text style={styles.noDataText}>No frames available</Text>
      </View>
    );
  }

  const handleAutoplay = () => {
    if (isAutoplaying) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };
  
  return (
    <View style={styles.frameCounterContainer}>
      <TouchableOpacity
        style={[
          styles.sideNavButton,
          isAutoplaying && styles.disabledButton,
        ]}
        onPress={onPreviousFrame}
        disabled={isAutoplaying}
      >
        <Text style={styles.sideNavButtonText}>
          ←
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sideNavButton,
          isAutoplaying && styles.disabledButton,
        ]}
        onPress={onNextFrame}
        disabled={isAutoplaying}
      >
        <Text style={styles.sideNavButtonText}>
          →
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.frameCounter}>
        Frame {currentFrameIndex + 1} of {frames.length}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.sideNavButton,
          isAutoplaying && styles.autoplayActive,
          !isAutoplayEnabled && styles.disabledButton,
        ]}
        onPress={handleAutoplay}
        disabled={!isAutoplayEnabled}
      >
        <Text style={styles.sideNavButtonText}>
          {isAutoplaying ? '⏸️' : '▶️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  inputSection: {
    marginTop: 20,
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
    marginBottom: 10,
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
  autoplayActive: {
    backgroundColor: '#28a745',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  qrCodeWrapper: {
    alignItems: 'center',
  },
});
