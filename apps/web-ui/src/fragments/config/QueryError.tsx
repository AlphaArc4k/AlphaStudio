import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface QueryErrorProps {
  error: {
    message: string;
    details?: string;
  };
  onDismiss: () => void;
}

export const QueryError: React.FC<QueryErrorProps> = ({ error, onDismiss }) => {
  return (
    <div className="space-y-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="flex items-start gap-2">
        <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-red-400 text-sm font-medium break-words"
              style={{
                whiteSpace: 'pre-line',
              }}
            >
              {error.message.split("\\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <button 
              onClick={onDismiss}
              className="shrink-0 p-1 text-red-400/50 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          {error.details && (
            <pre className="mt-2 text-xs text-red-400/70 font-mono whitespace-pre-wrap overflow-auto max-h-32">
              {error.details}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
