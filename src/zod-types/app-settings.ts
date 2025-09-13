import { z } from 'zod';


export const APP_SETTINGS_KEY = 'qr-io-app-settings';

export const AppSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  language: z.string(),
  autoBackup: z.boolean(),
  notifications: z.boolean(),
  dataRetentionDays: z.number(),
  qrTransmissionRate: z.number(),
  maxBytesPerQrCode: z.number(),
  debugMode: z.boolean(),
  showInspector: z.boolean(),
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;
