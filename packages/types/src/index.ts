
export interface AgentConfig {
  id ?: string;
  configVersion: string;
  isDeployed?: boolean;
  info: {
    name: string;
    description: string;
    version?: string;
    isPublic?: boolean;
    profileImage?: string;
    character: string;
    task: string;
  };
  data: {
    enabledViews: string[];
    userQuery: string;
    timeRange: {
      type: 'sliding' | 'fixed';
      sliding?: {
        startBacktest?: string; // during development
        minutes: 5 | 15 | 60;
      };
      fixed?: {
        start: string;
        end: string;
      };
    };
  };
  llm: {
    provider: string;
    model: string;
    temperature?: number;
    apiKey: string;
    framework?: string;

  };
  actions?: {
    twitter?: {
      enabled?: boolean;
      apiKey: string;
      apiSecret: string;
      accessToken?: string;
      accessSecret?: string;
      username?: string;
    }
  };
  knowledge: any;
  tools: {
    enabledTools: string[];
    configurations: Record<string, any>;
  };
}


export interface Model {
  name: string;
  model: string,
  description?: string;
  version?: string;

  status: 'available' | 'installed' | 'downloading' | 'error';
  
  downloadProgress?: number;
  installedAt?: Date;
  size?: string;
  details?: any;
}