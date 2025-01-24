import React from 'react';
import { Twitter, MessageSquare, Send } from 'lucide-react';
import TwitterAction from './TwitterAction';
import { useAgentConfig } from '../../../context/useAgentContext';

type ConnectionStatus = 'connected' | 'disconnected' | 'error'

const ActionsConfig: React.FC = () => {

  const { config, updateConfig } = useAgentConfig();
  const status: ConnectionStatus = (config.actions?.twitter?.enabled && !!config.actions.twitter.accessToken) ? 'connected' : 'disconnected';
  const twitterEnabled = !config.actions?.twitter?.enabled;
  const discordEnabled = false;
  const telegramEnabled = false;

  const handleToggleAction = (actionType: string) => {
    if (actionType !== 'twitter') {
      return;
    }
    updateConfig({
      type: 'UPDATE_ACTIONS',
      payload: {
        twitter: {
          apiKey: '',
          apiSecret: '',
          ...config.actions?.twitter,
          enabled: !config.actions?.twitter?.enabled
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-sm text-blue-400 mb-1">Actions</h2>
        <p className="text-sm text-gray-500">Configure how your agent interacts with external services</p>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {/* Twitter Integration */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Twitter size={16} className="text-gray-400" />
              <label className="text-sm font-medium">X Integration</label>
            </div>
            <button
              onClick={() => handleToggleAction('twitter')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${twitterEnabled ? 'bg-purple-500' : 'bg-gray-700'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${twitterEnabled ? 'translate-x-4' : ''
                }`} />
            </button>
          </div>
          {twitterEnabled && (
            <TwitterAction
              status={status}
              error={undefined}
            />
          )}
        </div>

        {/* Discord Integration */}
        {false && <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-400" />
              <label className="text-sm font-medium">Discord</label>
            </div>
            <button
              onClick={() => handleToggleAction('discord')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${discordEnabled ? 'bg-purple-500' : 'bg-gray-700'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${discordEnabled ? 'translate-x-4' : ''
                }`} />
            </button>
          </div>
          {discordEnabled && (
            <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
              Discord configuration coming soon...
            </div>
          )}
        </div>
        }

        {/* Telegram Integration */}
        {false && <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send size={16} className="text-gray-400" />
              <label className="text-sm font-medium">Telegram</label>
            </div>
            <button
              onClick={() => handleToggleAction('telegram')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${telegramEnabled ? 'bg-purple-500' : 'bg-gray-700'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${telegramEnabled ? 'translate-x-4' : ''
                }`} />
            </button>
          </div>
          {telegramEnabled && (
            <div className="p-4 bg-gray-900/50 rounded border border-gray-800">
              Telegram configuration coming soon...
            </div>
          )}
        </div>
        }
      </div>
    </div>
  );
};

export default ActionsConfig;