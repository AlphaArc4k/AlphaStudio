import { useState } from "react";
import { useApi } from "./useApi";

async function runAgentWithStreamedResults(config: any) {
  const { host } = useApi();
  const response = await fetch(`${host}/rpc/agents/run`, {
    method: 'POST',
    body: JSON.stringify(config),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.body) {
    throw new Error('ReadableStream not supported');
  }
  if (!response.status.toString().startsWith('2')) {
    throw new Error('Server stream error');
  }
  return response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream({
      transform(chunk, controller) {
        // Split chunked lines for processing
        chunk.split('\n').forEach((line) => {
          const l = line.trim();
          if (!l) return;
          const obj = JSON.parse(l);
          controller.enqueue(obj);
        });
      },
    }));
}

export const useAgentExecution = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<any[]>([])
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'agent', content: string }>>([]);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('')
  const runAgent = async (config: any) => {
    setIsRunning(true);
    setMessages([]);
    setLogs([]);
    setPrompt('');
    setError('');
    try {
      const stream = await runAgentWithStreamedResults(config);
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
        } else {
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsRunning(false);
    }
  }

  return { runAgent, isRunning, logs, prompt, messages, error };
}