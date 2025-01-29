
// TODO move types to type package

export interface Model {
  name: string;
  status: 'available' | 'installed' | 'downloading' | 'error';
  downloadProgress?: number;
  installedAt?: Date;
  size?: string;
  description?: string;
  version?: string;
}