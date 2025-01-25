"use client";
import React, { useState } from 'react';
import { Save, Circle, Rocket, AlertCircle, Bot, CloudUpload } from 'lucide-react';
import { LoadingButton } from '../components/LoadingButton';
import { useAgentConfig } from '../context/useAgentContext';
import { useToast } from '../hooks/useToast';
import { Modal } from '../components/Modal';
import { UserAgentOverviewPanel } from './UserAgentOverviewPanel';

interface HeaderProps {
  isActivated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isActivated = true,
}) => {

  const { config, updateConfig, saveConfig, isSaving } = useAgentConfig()
  const status = config?.isDeployed ? 'running' : 'ready' ;
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const { showErrorToast, showSuccessToast } = useToast()
  const [showLoadAgentModal, setShowLoadAgentModal] = useState(false)

  const agentName = config?.info?.name || 'Untitled Agent foo'
  const deployEnabled = config?.info?.isPublic && config?.info?.name && config?.info?.description;

  const statusColors = {
    running: 'text-green-400',
    ready: 'text-blue-400',
    error: 'text-red-400'
  };

  const statusText = {
    ready: 'Ready',
    running: 'Running',
    error: 'Error'
  };

  const onSave = async () => {
    const result = await saveConfig()
    if (result.error) {
      showErrorToast("Failed to save agent", result.error)
    } else {
      showSuccessToast("Agent saved")
    }
  }

  const onDeployModal = () => {
    setDeployModalOpen(true);
  }

  const onDeploy = async () => {
    setIsDeploying(true);
    try {
      // check that name and description are set
      if (!config.info.name || !config.info.description) {
        throw new Error('Agent name and description are required');
      }      
      if (!config.llm.apiKey) {
        throw new Error('API Key is required');
      }
 
      // make sure agent has id and is set to deployed
      updateConfig({
        type: 'UPDATE_DEPLOYED',
        payload: true
      });
      // FIXME update is not reflected due to closure, hacky solution is to provide changes
      const result = await saveConfig({
        isDeployed: true
      })
      if (result.error) {
        throw new Error(result.error)
      }
      console.log('result', result)
      showSuccessToast('Agent deployed successfully')
    } catch (error: any) {
      const errorResponse = error.response?.data?.error;
      if (!errorResponse) {
        showErrorToast(error?.message || 'Unknown Error')
        return 
      }
      showErrorToast('Failed to deploy agent', errorResponse || 'Unknown error')
    } finally {
      setIsDeploying(false);
      setDeployModalOpen(false);
    }
  }

  return (
    <div
      style={{
        height: 50
      }}
      className="h-12 border-b border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
      <LoadingButton
          className="px-3 py-1.5 text-sm border border-gray-800 rounded-md hover:bg-gray-800/50 flex items-center gap-1.5"
          onClick={() => setShowLoadAgentModal(true)}
        >
          <Bot size={14} />
          My Agents
        </LoadingButton>
        <span className="text-sm font-medium">{agentName}</span>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-900/50">
          <Circle className={`h-2 w-2 ${statusColors[status]}`} fill="currentColor" />
          <span className="text-xs text-gray-400">{statusText[status]}</span>
        </div>

        {!isActivated && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20">
            <AlertCircle size={14} className="text-yellow-500" />
            <span className="text-xs text-yellow-400">
              {'Activate by holding 10k $ALPHA'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <LoadingButton
          onClick={onSave}
          className="px-3 py-1.5 text-sm border border-gray-800 rounded-md hover:bg-gray-800/50 flex items-center gap-1.5"
          isLoading={isSaving}
          disabled={isSaving || isActivated == false}
          loadingText="Saving agent..."
        >
          <Save size={14} />
          Save
        </LoadingButton>
        <LoadingButton
          onClick={onDeployModal}
          disabled={!deployEnabled}
          isLoading={isDeploying}
          loadingText="Deploying agent..."
          className={
            "px-3 py-1.5 text-sm border border-gray-800 rounded-md hover:bg-gray-800/50 flex items-center gap-1.5"
          }
        >
          <Rocket size={14} />
          Deploy
        </LoadingButton>
      </div>
      <Modal isOpen={showLoadAgentModal} onClose={() => setShowLoadAgentModal(false)}>
          <UserAgentOverviewPanel />
      </Modal>
      <Modal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        >
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Deploy Agent</h2>
          <p className="text-sm text-slate-400 mb-3">
          Deploying an agent will make it visible on the hub for others to access.
          </p>
          <p className="text-sm text-slate-400 mb-3">
          Your agent will be triggered whenever new indexed data becomes available for the selected time frame. Logs will be accessible on the hub.
          </p>
          <p className="text-sm text-slate-400 mb-3">You must maintain a balance of 25,000 $ALPHA tokens in your wallet.</p>
          <LoadingButton
            onClick={onDeploy}
            className="px-3 py-1.5 text-sm border border-gray-800 rounded-md hover:bg-gray-800/50 flex items-center gap-1.5"
            isLoading={isDeploying}
            loadingText="Deploying agent..."
          >
            <CloudUpload size={14} />
            Deploy
          </LoadingButton>
        </div>
      </Modal>
    </div>
  );
};
