import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAgentConfig } from '../../context/useAgentContext';
import { AgentAvatar } from '../../components/AgentAvatar';
import { uploadProfileImage } from '../../lib/image/upload';
import TemplateSelector from './TemplateSelector';
import { VisibilityToggle } from './VisibilityToggle';
import { useToast } from '../../hooks/useToast';

interface InfoConfigProps {
  onUpdate?: (info: {
    name: string;
    description: string;
    character: string;
  }) => void;
}

export const AgentBasicConfig: React.FC<InfoConfigProps> = ({ }) => {

  const [showTemplates, setShowTemplates] = useState(false);

  const { config, updateConfig } = useAgentConfig();
  const { name, description, character, task } = config.info;

  const [isCharacterExpanded, setIsCharacterExpanded] = useState(false);
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const { showErrorToast } = useToast()

  const handleChange = (field: keyof typeof config.info, value: string | boolean | null) => {
    if (field === 'isPublic') {
      if (value === false) {
        updateConfig({
          type: 'UPDATE_DEPLOYED',
          payload: false
        });
      }
    }
    updateConfig({
      type: 'UPDATE_INFO',
      payload: { [field]: value }
    });
  };

  if (showTemplates) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-blue-400">Templates</h3>
          <button
            onClick={() => setShowTemplates(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            Back to Configuration
          </button>
        </div>
        <TemplateSelector
          onTemplatesChange={() => setShowTemplates(false)}
        />
      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* Basic Information */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm text-blue-400">Basic Information</h3>
          <button
            onClick={() => setShowTemplates(true)}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Browse Templates
          </button>
        </div>

        <div className="space-y-4">

          <VisibilityToggle
            isPublic={config.info.isPublic || false}
            onToggle={(value) => handleChange('isPublic', value)}
          />

          <AgentAvatar
            currentImage={config.info.profileImage}
            onChange={async (file: File | null) => {
              // Handle file upload/storage logic here
              // Then update the config with the new URL
              if (!file) return;
              try {
                const agent_uuid = config.id;
                if (!agent_uuid) {
                  console.error('Agent UUID not found');
                  return;
                }
                const imageUrl = await uploadProfileImage(file, agent_uuid);
                if (!imageUrl) {
                  console.error('Image URL not found');
                  return;
                }
                handleChange('profileImage', file ? imageUrl : null);
                console.log('Image URL:', imageUrl);
              } catch (error) {
                console.error('Error uploading image:', error);
                showErrorToast('Failed to upload image')
              }
            }}
            size="md"
          />

          <div>
            <label className="text-sm mb-1 block">Agent Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. CryptoAnalyst"
              className="w-full bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of what this agent does..."
              className="w-full h-24 bg-gray-900/50 p-3 rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>

        </div>
      </section>

      {/* Character Definition */}
      <section>
        <button
          onClick={() => setIsCharacterExpanded(!isCharacterExpanded)}
          className="w-full flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-colors group"
        >
          <div>
            <h3 className="text-sm text-blue-400 text-left">Character Definition</h3>
            <p className="text-xs text-gray-500">Define role, personality, and behavior</p>
          </div>
          <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
            {isCharacterExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {isCharacterExpanded && (
          <div className="mt-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Markdown supported</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleChange('character', character + '\n\n# New Section\nAdd content here...')}
                  className="px-2 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
                >
                  Add Section
                </button>
                <button
                  onClick={() => handleChange('character', '')}
                  className="px-2 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={character}
              onChange={(e) => handleChange('character', e.target.value)}
              className="w-full h-96 bg-gray-900/50 p-4 rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500/50 font-mono text-sm"
              placeholder={`# Role and Capabilities\nThe agent should...\n\n# Personality\nThe agent's personality is...\n\n# Communication Style\nWhen interacting, the agent should...`}
            />
          </div>
        )}
      </section>

      <section>
        <button
          onClick={() => setIsTaskExpanded(!isTaskExpanded)}
          className="w-full flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-colors group"
        >
          <div>
            <h3 className="text-sm text-blue-400 text-left">Task Definition</h3>
            <p className="text-xs text-gray-500">Define what the agent does</p>
          </div>
          <div className="text-gray-400 group-hover:text-purple-400 transition-colors">
            {isTaskExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {isTaskExpanded && (
          <div className="mt-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Markdown supported</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleChange('task', task + '\n\n# New Section\nAdd content here...')}
                  className="px-2 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
                >
                  Add Section
                </button>
                <button
                  onClick={() => handleChange('task', '')}
                  className="px-2 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={task}
              onChange={(e) => handleChange('task', e.target.value)}
              className="w-full h-96 bg-gray-900/50 p-4 rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500/50 font-mono text-sm"
              placeholder={`# Task and Objectives\nThe agent should...\n\n# Constraints and Guidelines\nThe agent must...`}
            />
          </div>
        )}
      </section>

    </div>
  );
};
