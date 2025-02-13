import { useState } from "react";
import { useApi } from "./useApi";
import { AgentConfig } from "../lib/AgentConfig";

// TODO duplicated type definition - see types
export interface Message {
  type: 'user' | 'agent';
  content: string 
}
// TODO duplicated type definition - see types
export interface AgentOverrides {
  message?: Message;
}

export const useAgentExecution = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<any[]>([])
  const [trace, setTrace] = useState({})
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('')
  const { postWithStreamedResult } = useApi()
  const runAgent = async (config: AgentConfig, overrides?: AgentOverrides) => {
    setIsRunning(true);
    setMessages([]);
    setLogs([]);
    setPrompt('');
    setError('');
    try {
      const stream = await postWithStreamedResult('/rpc/agents/run', {
        config,
        overrides
      });
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const log = value;
        if (log.status && log.status !== 200) {
          throw new Error(log.body.message);
        }
        if (log.type === 'INFO' || log.type === 'SUCCESS' || log.type === 'ERROR' || log.type === 'WARN') {
          setLogs(prev => [...prev, log]);
        }
        else if (log.type === 'PROMPT') {
          setPrompt(log.message);
        }
        else if (log.type === 'RESULT') {
          setMessages(prev => [...prev, { type: 'agent', content: log.data }]);
        }
        else if (log.type === 'TRACE') {
          console.log(log.data)
          setTrace(log.data?.messages || [])
        } 
        else {
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsRunning(false);
    }
  }

  return { runAgent, isRunning, logs, prompt, trace, messages, error, resetError: () => setError('') };
}