import React from 'react';
import { AlertCircle } from 'lucide-react';

interface BaseActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
  children: React.ReactNode;
}

const BaseAction: React.FC<BaseActionProps> = ({
  title,
  description,
  icon,
  status,
  error,
  children
}) => {
  const statusColors = {
    connected: 'text-green-400',
    disconnected: 'text-gray-500',
    error: 'text-red-400'
  };

  const statusText = {
    connected: 'Connected',
    disconnected: 'Not Connected',
    error: 'Error'
  };

  return (
    <div className="bg-[#1a1b26] border border-gray-800 rounded-lg">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">{title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            </div>
          </div>
          <span className={`text-xs ${statusColors[status]}`}>
            {statusText[status]}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20">
            <AlertCircle size={14} className="text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseAction;