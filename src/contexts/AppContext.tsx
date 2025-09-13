import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQrIoTbStore } from './QrIoStorageContext';
import { AppSettings } from '../zod-types/app-settings';
import { IBackendApi } from './qrio-backend-types';
import { BackendApi } from './backend-api';
import { DEFAULT_APP_SETTINGS } from '@/src/constants/tabs';


interface AppContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isLoading: boolean;
  backendApi: IBackendApi;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  console.log("APP PROVIDER - Starting");

  const { queryApi } = useQrIoTbStore();

  const [settings, setSettings] = useState<AppSettings>(() => {
    console.log("APP PROVIDER - Initializing settings with defaults");
    return DEFAULT_APP_SETTINGS;    
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    queryApi.setAppSettings({ ...settings, ...newSettings });
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
    
  const value: AppContextType = {
    settings,
    updateSettings,
    isLoading,
    backendApi: BackendApi,
  };

  return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
  );
};

AppProvider.displayName = 'AppProvider';

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
