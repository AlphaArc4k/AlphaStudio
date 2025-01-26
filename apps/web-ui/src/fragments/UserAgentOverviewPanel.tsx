import React from 'react'
import { useUserAgents } from '../hooks/useUserAgents'
import { Bot } from 'lucide-react';

export interface AgentCompact {
  id: string;
  name: string;
  agent_uuid: string;
  status: 'Beta' | 'running' | 'stopped' | 'error';
  isDeployed: boolean;
}

interface ActiveAgentsSectionProps {
  agents: Array<AgentCompact>;
}

const Link = ({href, children}:any) => <a href={href}>{children}</a>

export const ActiveAgentsSection: React.FC<ActiveAgentsSectionProps> = ({
  agents,
}) => {

  if (agents.length === 0) {
    return (
      <div className="bg-[#1a1b26] border border-gray-800 rounded-lg p-6">
        <h3 className="text-sm text-gray-400 mb-4">Active Agents</h3>
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-900/50 rounded-lg">
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
            <Bot size={24} className="text-purple-400" />
          </div>
          <div className="text-center space-y-2">
            <h4 className="font-medium">No Agents Yet</h4>
            <p className="text-sm text-gray-400 mb-4" style={{ marginBottom: 5 }}>
              Create your first AI agent now
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1b26] border border-gray-800 rounded-lg p-6">
      <h3 className="text-sm text-gray-400 mb-4">Active Agents</h3>
      <div className="space-y-2">
        {agents.map((agent) => (
          <Link
            href={`/agent/${agent.agent_uuid}`}
            key={agent.id}
            style={{ textDecoration: 'none' }}
          >
            <div 
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
              style={{ marginBottom: '0.25rem' }}
            >
              <div className="flex items-center gap-3">
                <Bot size={14} className="text-purple-400" />
                <span>{agent.name}</span>
              </div>
              <span 
                className={`text-xs px-2 py-1 rounded ${
                  agent.status === 'running' 
                    ? 'bg-green-500/10 text-green-400' 
                    : agent.status === 'error'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-gray-500/10 text-gray-400'
                }`}
              >
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};




export const UserAgentOverviewPanel: React.FC<any> = () => {

  const { agents, isLoading, error } = useUserAgents()
  if (error) {
    return <div>Failed to load agents</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {
        agents && Array.isArray(agents) && <ActiveAgentsSection agents={agents} />
      }
    </div>
  )
}
