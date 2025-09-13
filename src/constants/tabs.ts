import { TabConfig } from '../types';

export const TAB_CONFIGS: TabConfig[] = [
  {
    name: 'import',
    title: 'Import',
    icon: '📥',
  },
  {
    name: 'export',
    title: 'Export',
    icon: '📤',
  },
  {
    name: 'content',
    title: 'Content',
    icon: '📋',
  },
  {
    name: 'settings',
    title: 'Settings',
    icon: '⚙️',
  },
];

export const DEFAULT_APP_SETTINGS = {
  theme: 'light' as const,
  language: 'en',
  autoBackup: true,
  notifications: true,
  dataRetentionDays: 30,
  defaultAutoplayFramesPerSecond: 2,
  qrTransmissionRate: 2, // Default 10 fps
  maxBytesPerQrCode: 500, // Default 500 bytes per QR code
  debugMode: false,
  showInspector: false,
};
