"use client";
import React, { useState } from 'react';
import { Play, Save, Circle, Upload, CloudUpload, Rocket, AlertCircle, ExternalLink } from 'lucide-react';
import { LoadingButton } from '../components/LoadingButton';

interface HeaderProps {
  agentName?: string;
  status?: 'ready' | 'running' | 'error';
  isActivated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  agentName = 'Untitled Agent',
  isActivated = true,
}) => {

  // mock values
  const status = 'ready' as 'ready' | 'running' | 'error';
  const name = 'Untitled Agent';
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deployEnabled, setDeployEnabled] = useState(true);

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

  }

  const onDeployModal = () => {
  }

  const onDeploy = async () => {
    
  }

  return (
    <div 
      style={{
        height: 50
      }}
      className="h-12 border-b border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{name || agentName}</span>
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
    </div>
  );
};
