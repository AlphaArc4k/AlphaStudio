import React from 'react';
import { Globe, Copy } from 'lucide-react';
import BaseTrigger from './BaseTrigger';

interface WebhookTriggerProps {
  webhookUrl: string;
  isEnabled?: boolean;
  error?: string;
}

const WebhookTrigger: React.FC<WebhookTriggerProps> = ({
  webhookUrl,
  isEnabled,
  error
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
  };

  return (
    <BaseTrigger
      title="Webhook Trigger"
      description="Trigger agent on HTTP POST requests"
      icon={<Globe size={16} className="text-purple-400" />}
      isEnabled={isEnabled}
      error={error}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 p-2 bg-gray-900/50 rounded">
          <code className="text-xs text-gray-400 font-mono break-all">
            {webhookUrl}
          </code>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-400 rounded hover:bg-gray-800/50"
          >
            <Copy size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Send POST requests to this URL to trigger the agent
        </p>
      </div>
    </BaseTrigger>
  );
};

export default WebhookTrigger;