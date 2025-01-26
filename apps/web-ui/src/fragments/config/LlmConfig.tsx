import React, { useEffect, useState } from 'react';
import { useAgentConfig } from '../../context/useAgentContext';
import { useApi } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';

export const LLMConfig: React.FC = () => {

  const { config, updateConfig } = useAgentConfig();
  const { listLocalModels, addLocalModel } = useApi()

  const [providerModels, setProviderModels] = useState<any>({
    openai: {
      key: 'openai',
      displayName: 'OpenAI',
      models: [
        'gpt-4o',
        'gpt-4o-mini',
        'o1-preview',
        'o1-mini'
      ]
    },
  })

  const selectedProvider = config?.llm?.provider || 'openai'

  useEffect(() => {

    listLocalModels()
      .then(models => {
        setProviderModels((_models: any) => ({
          ..._models,
          'ollama': {
            key: 'ollama',
            displayName: 'Ollama',
            models: models.map((m: any) => m.model)
          }
        }))
      })
      .catch(e => {
        console.log('failed to get local models')
      })
  
    return () => {
    }
  }, [])
  

  const handleChange = (field: keyof typeof config.llm, value: string) => {
    updateConfig({
      type: 'UPDATE_LLM',
      payload: { [field]: value }
    });
    if (field === 'provider') {
      try {
        const firstModel = providerModels[value].models[0]
        updateConfig({
          type: 'UPDATE_LLM',
          payload: {
            model: firstModel
          }
        })
      } catch (error) {
        
      }
    }
  };

  const handleAddDeepseek = async () => {
    await addLocalModel()
  }

  if (!config) {
    return <div>loading..</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-blue-400 mb-3">Model Settings</h3>
        <div className="space-y-4">
          <div>
            <Button onClick={handleAddDeepseek}>Add Deepseek r1</Button>
            <label className="text-sm mb-1 block">Provider</label>
            <select 
              value={selectedProvider}
              className="w-full bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800"
              onChange={(e) => handleChange('provider', e.target.value)}
            >
              {Object.values(providerModels).map(
                (provider: any) => <option key={provider.key} value={provider.key}>{provider.displayName}</option>
              )}
              
            </select>
          </div>
          <div>
            <label className="text-sm mb-1 block">Model</label>
            <select 
              className="w-full bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800"
              onChange={(e) => handleChange('model' ,e.target.value)}
              value={config.llm.model}
            >
              {providerModels[selectedProvider]?.models.map((model: any) => (
                <option key={model} value={model}>{model}</option>
              ))}
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