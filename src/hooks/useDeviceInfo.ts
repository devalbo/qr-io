import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

interface DeviceInfo {
  isPhone: boolean;
  isTablet: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  shouldUseBottomTabs: boolean;
}

export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    const { width, height } = Dimensions.get('window');
    const isPortrait = height > width;
    const isPhone = width < 768;
    const isTablet = width >= 768;
    
    // Use bottom tabs for phones in portrait mode, or tablets in portrait mode
    const shouldUseBottomTabs = (isPhone || isTablet) && isPortrait;
    
    const deviceInfo = {
      isPhone,
      isTablet,
      isPortrait,
      isLandscape: !isPortrait,
      shouldUseBottomTabs,
    };
    
    console.log('useDeviceInfo:', { width, height, isPhone, isTablet, isPortrait, shouldUseBottomTabs });
    
    return deviceInfo;
  });

  useEffect(() => {
    const handleDimensionsChange = () => {
      const { width, height } = Dimensions.get('window');
      const isPortrait = height > width;
      const isPhone = width < 768;
      const isTablet = width >= 768;
      
      // Use bottom tabs for phones in portrait mode, or tablets in portrait mode
      const shouldUseBottomTabs = (isPhone || isTablet) && isPortrait;
      
      setDeviceInfo({
        isPhone,
        isTablet,
        isPortrait,
        isLandscape: !isPortrait,
        shouldUseBottomTabs,
      });
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  return deviceInfo;
};
