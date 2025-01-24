import React, { useEffect, useState } from 'react';
import { Send, RefreshCw, Copy, Lock, Check } from 'lucide-react';
import BaseAction from './BaseAction';
import { useAgentId } from '../../../hooks/useAgentId';
import { useToast } from '../../../hooks/useToast';

interface TelegramActionProps {
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
}

export const TelegramAction: React.FC<TelegramActionProps> = ({
  status = 'disconnected',
  error,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [botToken, setBotToken] = useState('123');
  const [isValidating, setIsValidating] = useState(false);
  const [isRefreshingLink, setIsRefreshingLink] = useState(false);
  const [connectedChats, _setConnectedChats] = useState<Array<{ id: string; name: string }>>([]);
  const [inviteLink, setInviteLink] = useState<string>('');
  const { showSuccessToast } = useToast()

  const agentId = useAgentId();

  const handleValidateToken = async () => {
    setIsValidating(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setShowConfig(false);
      // Assuming validation successful
    } catch (error) {
      console.error('Failed to validate token:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRefreshInviteLink = async () => {
    setIsRefreshingLink(true);
    try {
      setInviteLink(`https://t.me/AlphaArcBot?start=${agentId}`);
    } catch (error) {
      console.error('Failed to refresh invite link:', error);
    } finally {
      setIsRefreshingLink(false);
    }
  };

  useEffect(() => {
    if (!agentId) return;
    handleRefreshInviteLink();
    return () => {
    }
  }, [agentId])
  
  // TODO duplicated code
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccessToast('Copied to clipboard');
  };

  return (
    <BaseAction
      title="Telegram Integration"
      description="Send messages and receive commands via Telegram"
      icon={<Send size={16} className="text-purple-400" />}
      status={status}
      error={error}
    >
      <div className="space-y-4">
        {showConfig ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bot Token</label>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-900/50 rounded border border-gray-800 text-sm"
                placeholder="Enter your bot token from @BotFather"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this from Telegram's @BotFather
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfig(false)}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleValidateToken}
                disabled={!botToken || isValidating}
                className="px-3 py-1.5 bg-blue-500 rounded text-sm hover:bg-blue-600 disabled:opacity-50
                         flex items-center gap-2"
              >
                {isValidating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate & Save'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bot Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send size={14} className="text-gray-400" />
                <span className="text-sm text-gray-300">Telegram Bot</span>
              </div>
              <button
                onClick={() => setShowConfig(true)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Configure
              </button>
            </div>

            {botToken ? (
              <div className="space-y-4">
                {/* Invite Link Section */}
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Bot Invite Link</span>
                    <button
                      onClick={handleRefreshInviteLink}
                      disabled={isRefreshingLink}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                    >
                      <RefreshCw size={12} className={isRefreshingLink ? 'animate-spin' : ''} />
                      Refresh
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-1.5 bg-gray-900/70 rounded text-xs text-gray-400 font-mono truncate">
                      {inviteLink || 'Click refresh to generate link'}
                    </code>
                    <button
                      onClick={() => inviteLink && handleCopy(inviteLink)}
                      className="p-1.5 text-gray-500 hover:text-gray-400 rounded hover:bg-gray-800/50"
                      disabled={!inviteLink}
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Connected Chats */}
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">Connected Chats</h3>
                  {connectedChats.length > 0 ? (
                    <div className="space-y-2">
                      {connectedChats.map(chat => (
                        <div
                          key={chat.id}
                          className="flex items-center justify-between p-2 bg-gray-900/50 rounded"
                        >
                          <span className="text-sm text-gray-300">{chat.name}</span>
                          <Check size={14} className="text-green-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No chats connected. Share the invite link to connect chats.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock size={14} />
                <span>Configure bot token to get started</span>
              </div>
            )}
          </div>
        )}
      </div>
    </BaseAction>
  );
};
