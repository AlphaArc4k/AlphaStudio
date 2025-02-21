import React from 'react';
import { AlertCircle } from 'lucide-react';

interface BaseTool {
  title: string;
  description: string;
  icon: React.ReactNode;
  isEnabled?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const BaseTool: React.FC<BaseTool> = ({
  title,
  description,
  icon,
  isEnabled = true,
  error,
  children
}) => {
  return (
    <div className="bg-[#1a1b26] border border-gray-800 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20">
            <AlertCircle size={14} className="text-red-400" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        )}

        <div className={`mt-4 ${!isEnabled && 'opacity-50 pointer-events-none'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
