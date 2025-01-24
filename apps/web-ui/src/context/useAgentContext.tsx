import React, { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { AgentConfig } from '../lib/AgentConfig';
import { useApi } from '../hooks/useApi';

// Define all possible action types
type AgentConfigAction =
  | { type: 'UPDATE_ID'; payload: string }
  | { type: 'UPDATE_DEPLOYED'; payload: boolean }
  | { type: 'UPDATE_INFO'; payload: Partial<AgentConfig['info']> }
  | { type: 'UPDATE_DATABASE'; payload: Partial<AgentConfig['data']> }
  | { type: 'UPDATE_LLM'; payload: Partial<AgentConfig['llm']> }
  | { type: 'UPDATE_ACTIONS'; payload: Partial<AgentConfig['actions']> }
  | { type: 'UPDATE_TOOLS'; payload: Partial<AgentConfig['tools']> }
  | { type: 'APPLY_TEMPLATE'; payload: Partial<AgentConfig> }
  | { type: 'RESET_CONFIG' };

// Initial configuration state
const newConfig: AgentConfig = {
  id: undefined,
  configVersion: '1.0.0-beta',
  info: {
    name: '',
    description: '',
    character: '',
    task: '',
  },
  data: {
    enabledViews: [],
    userQuery: '',
    timeRange: {
      type: 'sliding',
      sliding: { minutes: 15 },
    },
  },
  llm: {
    provider: 'OpenAI',
    model: 'gpt-4o',
    temperature: 0,
    apiKey: '',
  },
  actions: {
    twitter: {
      enabled: false,
      apiKey: '',
      apiSecret: '',
    },
    telegram: {
      enabled: false
    }
  },
  knowledge: {},
  tools: {
    enabledTools: [],
    configurations: {},
  },
};

// Create context
interface AgentContextType {
  config: AgentConfig;
  updateConfig: (action: AgentConfigAction) => void;
  saveConfig: () => Promise<SaveResult>;
  isSaving: boolean;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

// Reducer function to handle all configuration updates
function configReducer(state: AgentConfig, action: AgentConfigAction): AgentConfig {
  switch (action.type) {
    case 'UPDATE_ID':
      return {
        ...state,
        id: action.payload,
      };
    case 'UPDATE_DEPLOYED':
      return {
        ...state,
        isDeployed: action.payload,
      };
    case 'UPDATE_INFO':
      return {
        ...state,
        info: { ...state.info, ...action.payload },
      };
    case 'UPDATE_DATABASE':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'UPDATE_LLM':
      return {
        ...state,
        llm: { ...state.llm, ...action.payload },
      };
    case 'UPDATE_ACTIONS':
      return {
        ...state,
        actions: { ...state.actions, ...action.payload },
      };
    case 'UPDATE_TOOLS':
      return {
        ...state,
        tools: { ...state.tools, ...action.payload },
      };
    case 'APPLY_TEMPLATE':
      return {
        ...state,
        ...action.payload,
      };
    case 'RESET_CONFIG':
      return newConfig;
    default:
      return state;
  }
}

// Provider component
interface AgentProviderProps {
  children: ReactNode;
  initialConfig?: Partial<AgentConfig>;
}

export interface SaveResult {
  data?: any
  error?: string
}

export const AgentProvider: React.FC<AgentProviderProps> = ({ children, initialConfig }) => {
  const initialConfigMerged = { ...newConfig, ...initialConfig };
  const [config, dispatch] = useReducer(configReducer, initialConfigMerged);
  const [isSaving, setIsSaving] = useState(false);
  const { saveConfig: saveConfigApi } = useApi()
  const saveConfig = async () => {
    setIsSaving(true);
    const result : SaveResult = {
      data: undefined,
      error: undefined
    }
    try {
      const data = await saveConfigApi(config)
      if (data.id) {
        dispatch({
          type: 'UPDATE_ID',
          payload: data.id
        })
        window.history.replaceState({}, '', `/${data.id}`)
      }
      result.data = data
    } catch (error: any) {
      const errorMessage = error.message
      result.error = errorMessage
    }
    finally {
      setIsSaving(false);
      return result
    }
  }

  const updateConfig = (action: AgentConfigAction) => {
    dispatch(action);
  };

  return (
    <AgentContext.Provider value={{ config, updateConfig, saveConfig, isSaving }}>
      {children}
    </AgentContext.Provider>
  );
};

// Custom hook for using the agent context
export const useAgentConfig = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgentConfig must be used within an AgentProvider');
  }
  return context;
};

export default AgentContext;