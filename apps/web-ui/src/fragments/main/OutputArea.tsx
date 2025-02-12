"use client";
import React, { useEffect, useState } from 'react';
import {
  PlayCircle, Terminal
} from 'lucide-react';
import { useAgentConfig } from '../../context/useAgentContext';
import { LoadingButton } from '../../components/LoadingButton';
import { useAgentExecution } from '../../hooks/useAgentExecution';
import LogsContainer from './LogsContainer';
import { useToast } from '../../hooks/useToast';
import { PortfolioView } from '../trading/PortfolioView';

const styles : any = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '300px 1fr 300px',
    overflow: 'hidden',
  },
  chatContainer: {
    position: 'relative' as const,
    display: 'flex',
    flex: 1,
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  toolbar: {
    borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
    padding: '1rem',
    display: 'flex',
    gap: '0.5rem',
    backgroundColor: 'rgba(26, 27, 38, 0.4)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1rem',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.75rem',
    transition: 'all 0.2s',
  },
  chatMessages: {
    padding: '1rem',
    flex: 1,
  },
  message: {
    marginBottom: '1rem',
    padding: '0.75rem',
    borderRadius: '4px',
    maxWidth: '80%',
  },
  userMessage: {
    marginLeft: 'auto',
  },
  agentMessage: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    marginRight: 'auto',
    color: '#ff3ea5',
  },
  inputContainer: {
    borderTop: '1px solid rgba(96, 165, 250, 0.2)',
    padding: '1rem',
    gap: '0.5rem',
    display: 'none',
  },
  input: {
    flex: 1,
    border: '1px solid rgba(96, 165, 250, 0.2)',
    borderRadius: '4px',
    padding: '0.75rem',
    color: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
  },
  logsContainer: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  logEntry: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  sectionTitle: {
    padding: '.35rem',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
  },
};

const TraceViewer: React.FC<any> = ({ trace }: any) => {
  if(!trace || Object.keys(trace).length == 0) return <div>no trace info</div>
  return (
    <div style={{
      padding: '.5rem'
    }}>
      <div>
        {trace.map((t: any) => (
          <div
            key={t.kwargs.id}
            style={{
              marginTop: '1rem',
              padding: 5,
              border: '1px solid #666',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div>{t.id[2]}</div>
            <div>{t.kwargs.content.slice(0, 100)+'...'}</div>
            {t.kwargs.response_metadata?.tokenUsage && <div>
              <div>Completion tokens: {t.kwargs.response_metadata.tokenUsage.completionTokens}</div>  
              <div>Prompt tokens: {t.kwargs.response_metadata.tokenUsage.promptTokens}</div>  
              <div>Total tokens: {t.kwargs.response_metadata.tokenUsage.totalTokens}</div>  
            </div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export const OutputArea: React.FC = () => {

  // FIXME hardcoded
  const isActivated = true;

  const { config } = useAgentConfig();
  const [activeTab, setActiveTab] = useState('output');
  const { runAgent, logs, messages, prompt, trace, isRunning, error: executionError, resetError } = useAgentExecution();
  const { showErrorToast } = useToast()

  const toggleRun = async () => {
    await runAgent(config);
  };

  useEffect(() => {
    if (!executionError) return
    showErrorToast(executionError)
    resetError()
    return () => {

    }
  }, [executionError])
  
  const tabs = [
    {value: 'output', display: 'Output'},
    {value: 'prompt', display: 'Prompt'},
    {value: 'trace', display: 'Trace'},
    {value: 'logs', display: 'Logs'},
    {value: 'portfolio', display: 'Portfolio'},
  ]

  return (
    <div
      id="main-content"
      style={styles.chatContainer}>
      <div style={styles.toolbar}>
        <div className="flex items-center">
          <div className="flex">
            {
              tabs.map(tab => (
                <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 h-12 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.value
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-400'
                  }`}
                disabled={
                  tab.value === 'prompt' && !prompt
                }
              >
                {tab.display}
              </button>
              ))
            }
          </div>
        </div>
        <LoadingButton
          onClick={toggleRun}
          isLoading={isRunning}
          loadingText="Running Agent"
          icon={<PlayCircle size={16} />}
          style={{
            ...styles.toolbarButton,
            backgroundColor: isRunning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(96, 165, 250, 0.1)',
          }}
          disabled={!isActivated || isRunning}
        > 
          Run Agent 
        </LoadingButton>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
          {activeTab === 'output' && (
            <div style={styles.chatMessages}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.message,
                    ...styles.agentMessage
                  }}
                >
                  <pre style={{
                    fontSize: '1rem',
                    whiteSpace: 'pre-wrap',
                  }}>{message.content}</pre>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'prompt' && (
            <div style={styles.chatMessages}>
              <div style={{
                ...styles.message,
                ...styles.agentMessage,
              }}>
                <pre style={{
                  fontSize: '1rem',
                  whiteSpace: 'pre-wrap',
                }}>{prompt}</pre>
              </div>
            </div>
          )}
          {activeTab === 'trace' && (
            <TraceViewer trace={trace}/>             
          )}
          {activeTab === 'portfolio' && (
            <PortfolioView />
          )}
        </div>
      </div>
      
      <LogsContainer>
        <div style={styles.logsContainer}>
          <div style={styles.sectionTitle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} />
              Execution Logs
            </div>
          </div>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '1rem',
          }}>
            {logs.map((log, index) => (
              <div key={index} style={styles.logEntry}>
                <span style={{

                  color: getLogColor(log.type),
                }}>{log.type}</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      </LogsContainer>
    </div>
  )
}

const getLogColor = (type: string) => {
  switch (type) {
    case 'INFO':
      return '#60a5fa';
    case 'SUCCESS':
      return '#34d399';
    case 'ERROR':
      return '#ef4444';
    case 'WARN':
      return '#f59e0b';
    default:
      return '#94a3b8';
  }
}