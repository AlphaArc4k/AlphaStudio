import React from 'react';
import { Progress } from '../../components/ui/progress';
import { Card, CardContent } from '../../components/ui/card';
import { Download, Check, Clock } from 'lucide-react';
import { Model } from '../../lib/types';

interface ModelCardProps {
  model: Model;
  onDownload: (modelName: string) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, onDownload }) => {
  return (
    <Card className="w-full bg-gray-900/50 border-gray-800/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-100">{model.name}</h3>
              {model.version && (
                <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded-full">
                  v{model.version}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{model.description || 'No description available'}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {model.size && (
              <span className="text-sm text-gray-500">{model.size}</span>
            )}
            
            {model.status === 'installed' ? (
              <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                <Check size={16} className="mr-1.5" />
                <span className="text-sm">Installed</span>
              </div>
            ) : model.status === 'downloading' ? (
              <div className="flex flex-col items-end space-y-2 min-w-[120px]">
                <div className="w-full">
                  <Progress 
                    value={model.downloadProgress} 
                    className="h-1.5 bg-gray-800"
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {model.downloadProgress}%
                </span>
              </div>
            ) : (
              <button
                onClick={() => onDownload(model.name)}
                className="flex items-center px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/20"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            )}
          </div>
        </div>
        
        {model.installedAt && (
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Clock size={12} className="mr-1.5" />
            Installed {new Date(model.installedAt).toLocaleDateString()} at{' '}
            {new Date(model.installedAt).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}