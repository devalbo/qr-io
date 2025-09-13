import { Store } from "tinybase/store";
import { APP_SETTINGS_KEY, AppSettings, AppSettingsSchema } from "../../zod-types/app-settings";
import { DEFAULT_APP_SETTINGS } from "@/src/constants/tabs";


export const setAppSettings = (store: Store, settings: AppSettings): void => {
  const appSettings = AppSettingsSchema.parse(settings);
  const appSettingsStr = JSON.stringify(appSettings);
  store.setValue(APP_SETTINGS_KEY, appSettingsStr);
};

export const getAppSettings = (store: Store): AppSettings => {
  const appSettingsStr = store.getValue(APP_SETTINGS_KEY);
  console.log('getAppSettings: App settings string:', appSettingsStr);

  if (!appSettingsStr) {
    return DEFAULT_APP_SETTINGS;
  }

  const appSettingsObj = JSON.parse(appSettingsStr as string);

  const appSettings = AppSettingsSchema.safeParse(appSettingsObj);
  if (!appSettings.success) {
    console.error('getAppSettings: Error parsing app settings:', appSettings.error);
    return DEFAULT_APP_SETTINGS;
  }

  return appSettings.data;
};
