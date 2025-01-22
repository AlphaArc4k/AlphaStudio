import React, { useState } from 'react';
import { Upload, X, Bot } from 'lucide-react';

interface AgentAvatarProps {
  currentImage?: string;
  onChange: (file: File | null) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({ 
  currentImage, 
  onChange,
  size = 'md'
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreviewUrl(null);
      onChange(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Agent Avatar</label>
      
      <div className="flex items-end gap-4">
        {/* Avatar Preview/Upload Area */}
        <div
          className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden
                     bg-gray-900/50 border-2 border-dashed
                     ${isDragging ? 'border-purple-500/50 bg-purple-500/10' : 'border-gray-800'}
                     transition-colors duration-200`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Preview or Placeholder */}
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Agent avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <Bot size={24} />
            </div>
          )}

          {/* Upload Overlay */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center
                          bg-black/50 opacity-0 hover:opacity-100 transition-opacity
                          cursor-pointer`}>
            <Upload size={20} className="text-white mb-1" />
            <span className="text-xs text-white">Upload Image</span>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </div>

        {/* Remove Button (if image exists) */}
        {previewUrl && (
          <button
            onClick={() => handleFileChange(null)}
            className="p-2 text-gray-500 hover:text-gray-400 rounded-lg hover:bg-gray-800/50"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600">
        Drag and drop or click to upload. PNG, JPG up to 2MB
      </p>
    </div>
  );
};
