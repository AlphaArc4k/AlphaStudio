import { formatDistanceToNow } from "date-fns";
import { Maximize2, Minimize2, Twitter, Zap } from "lucide-react";
import { useState } from "react";

export interface Log {
  id: number;
  tool: string;
  content: string;
  timestamp: string;
  icon?: React.ReactNode;
}

export const LogEntry: React.FC<{ log: Log }> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongContent = log.content.length > 200;

  return (
    <div className="p-3 space-y-2" style={{
      border: '1px solid #1a1b26',
    }}>
      {/* Tool name and timestamp */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {/*<span className="text-pink-400">⚡</span>*/}
          {log.tool === 'Twitter'
            ? <Twitter size={16} className="text-blue-400" />
            : <Zap size={16} className="text-blue-400" />
          }
          <span className="text-blue-400 font-medium">{log.tool}</span>
        </div>
        <span className="text-slate-500">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
      </div>

      {/* Content */}
      <div className="space-y-2 text-xs">
        <div
          style={{ borderRadius: '0.5rem', fontWeight: 700, lineHeight: 1.5 }}
          className={`text-slate-200 whitespace-pre text-wrap ${!isExpanded && hasLongContent ? 'line-clamp-6' : ''}`}>
          {log.content}
        </div>

        {hasLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3 h-3" />
                Show less
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3" />
                Show more
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};