import React, { createContext, useContext, ReactNode } from 'react';
import { SharedFileData } from '@/src/hooks/useFileIntentHandler';

interface FileIntentContextType {
  sharedFile: SharedFileData | null;
  isProcessing: boolean;
  clearSharedFile: () => void;
}

const FileIntentContext = createContext<FileIntentContextType | undefined>(undefined);

interface FileIntentProviderProps {
  children: ReactNode;
  sharedFile: SharedFileData | null;
  isProcessing: boolean;
  clearSharedFile: () => void;
}

export const FileIntentProvider = ({ 
  children, 
  sharedFile, 
  isProcessing, 
  clearSharedFile 
}: FileIntentProviderProps) => {
  return (
    <FileIntentContext.Provider value={{ sharedFile, isProcessing, clearSharedFile }}>
      {children}
    </FileIntentContext.Provider>
  );
};

export const useFileIntent = () => {
  const context = useContext(FileIntentContext);
  if (context === undefined) {
    throw new Error('useFileIntent must be used within a FileIntentProvider');
  }
  return context;
};
