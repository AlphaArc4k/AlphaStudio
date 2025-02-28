export const TraceViewer: React.FC<any> = ({ trace }: any) => {
  if(!trace || Object.keys(trace).length == 0) {
    return (
      <div className="p-4 text-gray-500 text-center italic">
        No trace information available
      </div>
    )
  }

  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-gray-950">
      <div className="space-y-4">
        {trace.map((t: any) => (
          <div
            key={t.kwargs.id}
            className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-100">{t.id[2]}</h3>
              {t.kwargs.response_metadata?.tokenUsage && (
                <div className="flex gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>🎯</span>
                    <span>{t.kwargs.response_metadata.tokenUsage.completionTokens} completion</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💭</span>
                    <span>{t.kwargs.response_metadata.tokenUsage.promptTokens} prompt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📊</span>
                    <span>{t.kwargs.response_metadata.tokenUsage.totalTokens} total</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-gray-300 font-mono text-sm bg-black p-3 rounded">
              {t.kwargs.content.slice(0, 100)}
              {t.kwargs.content.length > 100 && (
                <span className="text-gray-500">...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}