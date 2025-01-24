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
    },
    telegram?: {
      enabled?: boolean
    }
  };
  knowledge: any;
  tools: {
    enabledTools: string[];
    configurations: Record<string, any>;
  };
}

export const validateConfig = (config: any) => {
  const configProperties = ['info', 'data', 'llm']
  for (const prop of configProperties) {
    if (!config[prop]) {
      return { error: `Invalid config:\nmissing property: ${prop}`, valid: false };
    }
  }

  if (!config.info.name) {
    return { error: 'Invalid config:\nmissing agent name', valid: false };
  }

  if (!config.info.description) {
    return { error: 'Invalid config:\nmissing agent description', valid: false };
  }

  if (!config.llm?.provider) {
    return { error: 'Invalid config:\nmissing llm provider', valid: false };
  }
  if (!config.llm.apiKey) {
    return { error: 'Invalid config:\nmissing llm apiKey', valid: false };
  }

  return { valid: true };
}