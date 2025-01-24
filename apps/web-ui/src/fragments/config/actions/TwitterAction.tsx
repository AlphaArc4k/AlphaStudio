import React, { useState } from 'react';
import { Twitter, Key, Link2, Lock, Copy, RefreshCcw } from 'lucide-react';
import BaseAction from './BaseAction';
import { useAgentConfig } from '../../../context/useAgentContext';
import { LoadingButton } from '../../../components/LoadingButton';
import { useAgentId } from '../../../hooks/useAgentId';
import { useApi } from '../../../hooks/useApi';
import { useToast } from '../../../hooks/useToast';

interface TwitterActionProps {
  status: 'connected' | 'disconnected' | 'error';
  accountName?: string;
  error?: string;
}

export const TwitterAction: React.FC<TwitterActionProps> = ({
  status,
  error,
}) => {
  const [showTokens, setShowTokens] = useState(false);
  const aid = useAgentId();
  const { config, updateConfig, saveConfig, isSaving } = useAgentConfig();
  const [authUrls, setAuthUrls] = useState({ authUrl: '', callbackUrl: '' });
  const twitterConfig: { apiKey: string; apiSecret: string } = config.actions?.twitter || { apiKey: '', apiSecret: '' };
  const [isRequestingAuthUrl, setIsRequestingAuthUrl] = useState(false)
  const { getTwitterAuthCallback, getTwitterAuthLink } = useApi()
  const accountName = config.actions?.twitter?.username || '';
  const { showSuccessToast, showErrorToast } = useToast()

  const handleCredentialsChange = (field: 'apiKey' | 'apiSecret' | 'enabled', value: string | boolean) => {
    updateConfig({
      type: 'UPDATE_ACTIONS',
      payload: {
        twitter: {
          ...twitterConfig,
          [field]: value
        }
      }
    });
  };

  const handleSaveTokens = async () => {
    try {
      const { error } = await saveConfig();
      if (error) {
        showErrorToast(error)
      }
    } catch (error: any) {
      showErrorToast(error.message || 'Unknown Error')
    }
  };

  const fetchAuthLink = async () => {
    if (!twitterConfig?.apiKey || !twitterConfig?.apiSecret) {
      showErrorToast('API Key and API Secret are required');
      return;
    }
    setIsRequestingAuthUrl(true);
    try {
      const authUrl = await getTwitterAuthLink(aid)
      setAuthUrls({ ...authUrls, authUrl });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch auth link';
      showErrorToast(errorMessage);
    } finally {
      setIsRequestingAuthUrl(false);
    }
  }

  const fetchCallbackLink = async () => {
    try {
      const callbackUrl = await getTwitterAuthCallback(aid)
      setAuthUrls({ ...authUrls, callbackUrl: callbackUrl });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch callback link';
      showErrorToast(errorMessage);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccessToast('Copied to clipboard');
  }

  return (
    <BaseAction
      title="X Integration"
      description="Post updates and interact with X"
      icon={<Twitter size={16} className="text-purple-400" />}
      status={status}
      error={error}
    >
      <div className="space-y-4">
        {status === 'connected' ? (
          <>
            {/* Connected State */}
            <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">@{accountName}</span>
              </div>
              <button
                onClick={_e => handleCredentialsChange('enabled', false)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Disconnect
              </button>
            </div>

            {/* Token Management */}
            <div>
              <button
                onClick={() => setShowTokens(!showTokens)}
                className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1"
              >
                <Key size={12} />
                {showTokens ? 'Hide' : 'Show'} API Tokens
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Disconnected State */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Lock size={14} />
                <span>Configure API access to enable X integration</span>
              </div>

              <button
                onClick={() => setShowTokens(true)}
                className="w-full px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20
                         flex items-center justify-center gap-2 text-sm"
              >
                <Link2 size={14} />
                Connect X Account
              </button>
            </div>
          </>
        )}

        {/* API Token Configuration */}
        {showTokens && (
          <div className="space-y-3 mt-4 p-3 bg-gray-900/50 rounded border border-gray-800">
            <div>
              <label className="text-xs text-gray-500 block mb-1">API Key</label>
              <input
                type="password"
                value={twitterConfig?.apiKey}
                onChange={(e) => handleCredentialsChange('apiKey', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-900/50 rounded border border-gray-800 text-sm"
                placeholder="Enter your API key"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">API Secret</label>
              <input
                type="password"
                value={twitterConfig?.apiSecret}
                onChange={(e) => handleCredentialsChange('apiSecret', e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-900/50 rounded border border-gray-800 text-sm"
                placeholder="Enter your API secret"
              />
            </div>
            <div className="flex justify-end gap-2">
              <LoadingButton
                onClick={handleSaveTokens}
                className="px-3 py-1.5 text-sm border border-gray-800 rounded-md hover:bg-gray-800/50 flex items-center gap-1.5"
                isLoading={isSaving}
                loadingText='Saving...'
              >
                Save Tokens
              </LoadingButton>
            </div>

            {/* Callback URL */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">Callback URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-1.5 bg-gray-900/70 rounded text-xs text-gray-400 font-mono truncate">
                  {authUrls?.callbackUrl || 'Click refresh to generate URL'}
                </code>
                <button
                  onClick={() => authUrls?.callbackUrl && handleCopy(authUrls.callbackUrl)}
                  className="p-1.5 text-gray-500 hover:text-gray-400 rounded hover:bg-gray-800/50"
                  disabled={!authUrls?.callbackUrl}
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => fetchCallbackLink()}
                  className="p-1.5 text-gray-500 hover:text-gray-400 rounded hover:bg-gray-800/50"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Use this URL in your X App settings</p>
            </div>

            {/* Auth URL */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">Auth URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-1.5 bg-gray-900/70 rounded text-xs text-gray-400 font-mono truncate">
                  {isRequestingAuthUrl
                    ? 'Generating URL...'
                    : authUrls?.authUrl || 'Click refresh to generate URL'
                  }
                </code>
                <button
                  onClick={() => authUrls?.authUrl && handleCopy(authUrls.authUrl)}
                  className="p-1.5 text-gray-500 hover:text-gray-400 rounded hover:bg-gray-800/50"
                  disabled={!authUrls?.authUrl}
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => fetchAuthLink()}
                  className="p-1.5 text-gray-500 hover:text-gray-400 rounded hover:bg-gray-800/50"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseAction>
  );
};

export default TwitterAction;