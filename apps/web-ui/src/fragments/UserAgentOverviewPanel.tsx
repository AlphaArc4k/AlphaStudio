import React from 'react'
import { useUserAgents } from '../hooks/useUserAgents'

export const UserAgentOverviewPanel: React.FC<any> = () => {

  const { agents, isLoading, error } = useUserAgents()
  console.log(agents, isLoading, error)
  if (error) {
    return <div>Failed with error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {
        agents && Array.isArray(agents) && agents.length > 0
        ? agents.map((agent: any) => <div key={agent.id}>Agent {agent.id}</div>)
        : <div>No agents created</div>
      }
    </div>
  )
}
