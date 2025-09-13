import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQrIoTbStore } from './QrIoStorageContext';
import { AppSettings } from '../zod-types/app-settings';
import { IBackendApi } from './qrio-backend-types';
import { BackendApi } from './backend-api';


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

  const [settings, setSettings] = useState(() => {
    console.log("APP PROVIDER - Initializing settings with defaults");
    return {} as AppSettings; // Start with empty settings
  });
  const [isLoading, setIsLoading] = useState(false);

  // Temporarily disable store dependency
  const queryApi = null;

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    if (queryApi) {
      queryApi.setAppSettings({ ...settings, ...newSettings });
    }
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
