import React, { useState } from 'react';
import WebhookTrigger from './WebhookTrigger';
import MessageTrigger from './MessageTrigger';
import ScheduleTrigger from './ScheduleTrigger';

interface TriggerConfig {
  type: 'webhook' | 'message' | 'schedule' | 'blockchain';
  enabled: boolean;
  error?: string;
  display?: boolean;
}

export const TriggersConfig: React.FC = () => {
  const [triggers, setTriggers] = useState<Record<string, TriggerConfig>>({
    webhook: { type: 'webhook', enabled: false, display: false },
    message: { type: 'message', enabled: false, display: false },
    schedule: { type: 'schedule', enabled: false, display: false },
    blockchain: { type: 'blockchain', enabled: false, display: false }
  });

  const handleToggleTrigger = (triggerType: string) => {
    setTriggers(prev => ({
      ...prev,
      [triggerType]: {
        ...prev[triggerType],
        enabled: !prev[triggerType].enabled
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-sm text-blue-400 mb-1">Triggers</h2>
        <p className="text-sm text-gray-500">Configure when your agent should run</p>
      </div>

      {/* Triggers List */}
      <div className="space-y-4">
        {/* Webhook Trigger */}
        {triggers.webhook.display && <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">HTTP Webhook</label>
            <button
              onClick={() => handleToggleTrigger('webhook')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${triggers.webhook.enabled ? 'bg-purple-500' : 'bg-gray-700'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${triggers.webhook.enabled ? 'translate-x-4' : ''
                }`} />
            </button>
          </div>
          {triggers.webhook.enabled && (
            <WebhookTrigger
              webhookUrl="https://api.example.com/webhook/xyz123"
              isEnabled={triggers.webhook.enabled}
              error={triggers.webhook.error}
            />
          )}
        </div>
        }

        {/* Message Trigger */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Messages</label>
            <button
              onClick={() => handleToggleTrigger('message')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${triggers.message.enabled ? 'bg-purple-500' : 'bg-gray-700'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${triggers.message.enabled ? 'translate-x-4' : ''
                }`} />
            </button>
          </div>
          {triggers.message.enabled && (
            <MessageTrigger
              isEnabled={triggers.message.enabled}
              error={triggers.message.error}
              onSave={() => { }}
            />
          )}
        </div>

        {/* Schedule Trigger */}
        {triggers.schedule.display && <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Schedule</label>
            <button
              onClick={() => handleToggleTrigger('schedule')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${triggers.schedule.enabled ? 'bg-purple-500' : 'bg-gray-700'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${triggers.schedule.enabled ? 'translate-x-4' : ''
                }`} />
            </button>
          </div>
          {triggers.schedule.enabled && (
            <ScheduleTrigger
              isEnabled={triggers.schedule.enabled}
              error={triggers.schedule.error}
              onSave={() => { }}
            />
          )}
        </div>
        }

        {/* Blockchain Events Trigger */}
        <div className="flex flex-col gap-2" style={{
          display: 'none'
        }}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Blockchain Events</label>
            <button
              onClick={() => handleToggleTrigger('blockchain')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${triggers.blockchain.enabled ? 'bg-purple-500' : 'bg-gray-700'
                }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${triggers.blockchain.enabled ? 'translate-x-4' : ''
                }`} />
            </button>
          </div>
          {triggers.blockchain.enabled && (
            <div>todo</div>
          )}
        </div>
      </div>
    </div>
  );
};
