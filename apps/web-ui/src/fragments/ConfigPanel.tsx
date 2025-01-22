import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ConfigPanelProps {
  width: number;
  title: string;
  onClose: () => void;
  onResize: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  width,
  title,
  onClose,
  onResize,
  children,
}) => {
  return (
    <div className="flex" style={{ width: `${width}px`, overflow: 'hidden' }}>
      <div className="flex flex-col flex-1 bg-[#12131A] border-r border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-medium">{title}</h2>
        </div>
        <div className="p-4 overflow-auto">
          {children}
        </div>
      </div>
      
      {/* Resize Handle */}
      <div
        onMouseDown={onResize}
        className="w-1 bg-transparent hover:bg-purple-500/50 cursor-col-resize transition-colors"
      />
    </div>
  );
};
