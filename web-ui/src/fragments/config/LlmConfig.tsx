import React from 'react';
import { useAgentConfig } from '../../context/useAgentContext';

export const LLMConfig: React.FC = () => {

  const { config, updateConfig } = useAgentConfig();

  const handleChange = (field: keyof typeof config.llm, value: string) => {
    updateConfig({
      type: 'UPDATE_LLM',
      payload: { [field]: value }
    });
  };

  const handleProviderChange = (_value: string) => {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-blue-400 mb-3">Model Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm mb-1 block">Provider</label>
            <select 
              className="w-full bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800"
              onChange={(e) => handleProviderChange?.(e.target.value)}
            >
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <div>
            <label className="text-sm mb-1 block">Model</label>
            <select 
              className="w-full bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800"
              onChange={(e) => handleChange('model' ,e.target.value)}
            >
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="o1-preview">o1-preview</option>
              <option value="o1-mini">o1-mini</option>
            </select>
          </div>
          <div>
            <label className="text-sm mb-1 block">API Key</label>
            <input 
              type="password"
              value={config.llm.apiKey}
              className="w-full bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800"
              onChange={(e) => handleChange('apiKey', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMConfig;