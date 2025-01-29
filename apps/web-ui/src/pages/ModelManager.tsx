import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Model } from '../lib/types';
import { ModelList } from '../fragments/models/ModelList';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';

export const ModelManager: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { listLocalModels, postWithStreamedResult } = useApi()
  const { showErrorToast } = useToast()

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const models = await listLocalModels()
      setModels(models);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  // TODO move to api
  const handleDownload = async (modelName: string) => {
    try {
      const stream = await postWithStreamedResult('/local/models', { model: modelName })
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value.type == 'progress') {
          // console.log('downlaod progress', value)
          const progress = value.data
          setModels(models.map(model => 
            model.name === modelName 
              ? { ...model, status: 'downloading', downloadProgress: progress }
              : model
          ));
        }else {
          console.log('value', value)
        }
      }
      await fetchModels()
    } catch (error) {
      showErrorToast("Failed to download model")
      console.error('Failed to start download:', error);
    }
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#0D0D12]  text-white">
      <div className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">AI Models</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      <ModelList models={filteredModels} onDownload={handleDownload} />
    </div>
  );
};
