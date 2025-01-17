import React from 'react';

interface MainContentProps {
  isResizing: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({ isResizing }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      {isResizing && (
        <div 
          className="fixed inset-0 z-50 cursor-col-resize" 
          style={{ cursor: 'col-resize' }}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        <div>Main Content</div>
      </div>
    </div>
  );
};
