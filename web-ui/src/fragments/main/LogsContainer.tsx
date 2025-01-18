import React, { useState, useEffect } from 'react';
import { GripHorizontal } from 'lucide-react';

interface LogsContainerProps {
  children: React.ReactNode;
}

const LogsContainer: React.FC<LogsContainerProps> = ({ children }) => {
  const [height, setHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.getElementById('main-content')?.getBoundingClientRect();
    if (!container) return;

    // Calculate height relative to the main content area
    const minHeight = 100;
    const maxHeight = container.bottom - container.top - 100; // Leave space for header
    const newHeight = Math.max(minHeight, Math.min(maxHeight, container.bottom - e.clientY));
    
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      className="border-t border-gray-800"
      style={{ 
        position: 'relative',
        height,
        overflow: 'auto',
        zIndex: 998,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Resize Handle */}
      <div
        style={{
          height: '1.1rem',
        }}
        className="-translate-y-1.5 h-1.5 flex items-center justify-center cursor-row-resize group"
        onMouseDown={handleMouseDown}
      >
        <div className="h-1.5 w-full bg-gray-800 group-hover:bg-gray-700">
          <div className="flex justify-center">
            <GripHorizontal 
              size={12} 
              className="text-gray-600 group-hover:text-gray-400 -translate-y-0.5" 
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex flex-column">
        {children}
      </div>

      {/* Resize Overlay */}
      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-row-resize" />
      )}
    </div>
  );
};

export default LogsContainer;