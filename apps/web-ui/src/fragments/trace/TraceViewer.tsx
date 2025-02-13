

export const TraceViewer: React.FC<any> = ({ trace }: any) => {
  if(!trace || Object.keys(trace).length == 0) return <div style={{ padding: '.5rem' }}>no trace info</div>
  return (
    <div style={{
      padding: '.5rem',
      border: '1px solid #1a1b26',
    }}
    className="p-3 space-y-2" 
    >
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