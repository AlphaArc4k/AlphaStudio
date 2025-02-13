import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import BaseTrigger from './BaseTrigger';

interface MessageTriggerProps {
  isEnabled?: boolean;
  error?: string;
  onSave: (channels: string[]) => void;
}

const MessageTrigger: React.FC<MessageTriggerProps> = ({
  isEnabled,
  error,
  onSave
}) => {
  const [channels, setChannels] = useState<string[]>([]);
  const [newChannel, setNewChannel] = useState('');

  const handleAddChannel = () => {
    if (newChannel && !channels.includes(newChannel)) {
      setChannels([...channels, newChannel]);
      setNewChannel('');
    }
  };

  const handleRemoveChannel = (channel: string) => {
    setChannels(channels.filter(c => c !== channel));
  };

  return (
    <BaseTrigger
      title="Message Trigger"
      description="Trigger agent when messages are received"
      icon={<MessageCircle size={16} className="text-purple-400" />}
      isEnabled={isEnabled}
      error={error}
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            placeholder="Enter channel name"
            className="flex-1 px-3 py-1.5 bg-gray-900/50 rounded border border-gray-800 text-sm"
          />
          <button
            onClick={handleAddChannel}
            className="px-3 py-1.5 bg-purple-500 rounded text-sm"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {channels.map(channel => (
            <div
              key={channel}
              className="flex items-center justify-between p-2 bg-gray-900/50 rounded"
            >
              <span className="text-sm text-gray-300">{channel}</span>
              <button
                onClick={() => handleRemoveChannel(channel)}
                className="text-xs text-gray-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </BaseTrigger>
  );
};

export default MessageTrigger;