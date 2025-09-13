import { Platform } from "react-native";
import { Store } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
import { useCreatePersister, useCreateStore, useRowCountListener, useRowListener } from "tinybase/ui-react";



// Helper function to create the appropriate persister based on platform
export const createPlatformPersister = async (store: Store) => {
  console.log("Creating platform persister for platform:", Platform.OS);
  
  if (Platform.OS === 'web') {
    // Use browser persister for web
    console.log("Creating browser persister...");
    try {
      const persister = createLocalPersister(store, 'qr-io');
      console.log("Browser persister created successfully");
      return persister;
    } catch (error) {
      console.error('Failed to create browser persister:', error);
      throw error;
    }
  } else {
    // Use SQLite persister for native platforms
    // Use eval to prevent bundler from trying to resolve these modules at build time
    try {
      const sqliteModule = eval('require("expo-sqlite")');
      const persisterModule = eval('require("tinybase/persisters/persister-expo-sqlite")');
      
      console.log("OPENING DB");
      const db = sqliteModule.openDatabaseSync('qr-io.db');
      console.log("DB CREATED");

      const persister = persisterModule.createExpoSqlitePersister(store, db, "qr-io");
      return persister;
    } catch (error) {
      console.error('Failed to load SQLite persister:', error);
      // Fallback to browser persister if SQLite fails
      const persister = createLocalPersister(store, 'qr-io');
      return persister;
    }
  }
};

