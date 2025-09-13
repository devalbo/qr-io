
export type TabName = 'import' | 'export' | 'settings' | 'content';

export interface TabConfig {
  name: TabName;
  title: string;
  icon: string;
}
