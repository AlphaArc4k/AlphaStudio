import React from 'react';
import { Globe, Lock } from 'lucide-react';

interface VisibilityToggleProps {
  isPublic: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  isPublic,
  onToggle,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
      <div className="flex items-center gap-3">
        {isPublic ? (
          <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Globe size={16} className="text-purple-400" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center">
            <Lock size={16} className="text-gray-400" />
          </div>
        )}
        <div>
          <div className="font-medium">
            {isPublic ? 'Public Agent' : 'Private Agent'}
          </div>
          <div className="text-xs text-gray-500">
            {isPublic 
              ? 'Anyone can view this agent on the hub'
              : 'Only you can access this agent'
            }
          </div>
        </div>
      </div>

      <button
        onClick={() => !disabled && onToggle(!isPublic)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isPublic 
            ? 'bg-purple-500 hover:bg-purple-600' 
            : 'bg-gray-700 hover:bg-gray-600'
          }`
        }
      >
        <div 
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
            ${isPublic ? 'left-7' : 'left-1'}`
          }
        />
      </button>
    </div>
  );
};
