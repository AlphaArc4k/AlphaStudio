
import { useState } from 'react'
import { Log, LogEntry } from './LogEntry'

export function LogViewer() {
  const [logs, setLogs] = useState<Log[]>([
    {
      id: 1,
      tool: 'foo',
      content: 'foo',
      timestamp: '12345',
      icon: <span>bar</span>
    }
  ])
  return (
    <div
      className="flex-1 p-3 divide-y overflow-y-auto">
      {logs.map((log) => (
        <LogEntry key={log.id} log={log} />
      ))
      }
    </div>

  )
}

