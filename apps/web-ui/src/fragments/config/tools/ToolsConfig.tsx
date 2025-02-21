import React from 'react';
import { PaperTradingTool } from './PaperTradingTool';

export const ToolsConfig: React.FC = () => {

  // TODO modify agent config here
  const tradingEnabled = false
  const handleToggleTool = (_f: string) => {
    console.log('toggle tool', _f)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-sm text-blue-400 mb-1">Tools</h2>
        <p className="text-sm text-gray-500">Configure tools the agent has access to</p>
      </div>

      {/* Tools List */}
      <div className="space-y-4">
        {/* Paper Trading Tools */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Paper Trading</label>
            <button
              onClick={() => handleToggleTool('paper_trading')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${tradingEnabled ? 'bg-purple-500' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${tradingEnabled ? 'translate-x-4' : ''}`} />
            </button>
          </div>
          <PaperTradingTool />
        </div>
      </div>
    </div>
  );
};
