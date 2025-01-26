import { Play } from 'lucide-react';
import React, { useState } from 'react';
import { useAgentConfig } from '../../context/useAgentContext';
import { LoadingButton } from '../../components/LoadingButton';
import Radio from '../../components/Radio';
import DateTimePicker from '../../components/DateTimePicker';
import { Table } from '../../components/Table';
import { QueryError } from './QueryError';
import { useApi } from '../../hooks/useApi';

interface View {
  id: string;
  name: string;
}

const styles = {
  toolbar: {
    borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
    padding: '1rem',
    display: 'flex',
    gap: '0.5rem',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  toolbarButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    border: '1px solid rgba(96, 165, 250, 0.2)',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
  },
}

interface DatabaseConfigProps {
  availableViews?: View[];
  enabledWindows?: number[];
  onViewsChange?: (selectedViews: string[]) => void;
  isActivated?: boolean;
}

export const DatasourceConfig: React.FC<DatabaseConfigProps> = ({
  enabledWindows = [5, 15, 60],
  isActivated = false,
}) => {
  const showBackTest = true

  const { config, updateConfig } = useAgentConfig();
  const { timeRange, userQuery } = config.data;

  const [queryResult, setQueryResult] = useState<any>(null);
  const [runningQuery, setRunningQuery] = useState(false);
  const [queryDuration, setQueryDuration] = useState(0)
  const [queryError, setQueryError] = useState<string | undefined>(undefined)
  const [info, setInfo] = useState('')
  const { queryData } = useApi()

  const handleRunQuery = async () => {
    setRunningQuery(true);
    setQueryResult(null);
    setQueryError(undefined);
    setInfo('')
    const queryStartTime = Date.now();
    try {
      const data = await queryData(userQuery, config.data.timeRange.sliding)
      const { result, timeInterval } = data;
      if (result.error) {
        setQueryError(result.error);
        return;
      }
      setInfo(`Using time interval ${timeInterval.date} hour offset ${timeInterval.hour} range ${timeInterval.range}`)
      setQueryResult(result.data);
      setQueryDuration(Date.now() - queryStartTime);
    } catch (error: any) {
      setQueryError(error.message);
    } finally {
      setRunningQuery(false);
    } 
  };

  const handleChange = (field: keyof typeof config.data, value: string) => {
    updateConfig({
      type: 'UPDATE_DATABASE',
      payload: { [field]: value }
    });
  };

  const slidingDefaultDate = '2025-01-05T12:00:00Z';

  const handleTimeRangeTypeChange = (type: 'sliding' | 'fixed') => {
    updateConfig({
      type: 'UPDATE_DATABASE',
      payload: {
        timeRange: {
          type,
          ...(type === 'sliding' ? { sliding: { minutes: 5, startBacktest: slidingDefaultDate } } : {}),
          ...(type === 'fixed' ? {
            fixed: {
              start: '2024-12-28 12:00',
              end: '2024-12-28 12:05'
            }
          } : {})
        }
      }
    });
  };

  const handleSlidingWindowChange = (minutes: 5 | 15 | 60, startBacktest = slidingDefaultDate) => {
    updateConfig({
      type: 'UPDATE_DATABASE',
      payload: {
        timeRange: {
          type: 'sliding',
          sliding: { minutes, startBacktest }
        }
      }
    });
  };

  const handleDateChange = (date?: Date, type?: 'start' | 'end') => {
    console.log(date, type);
  };

  const renderResultTable = () => {
    if (!queryResult) return null;
    if (queryResult.length === 0) return <div>No results found</div>;
    const columns = Object.keys(queryResult[0]);
    if (columns.length === 0) return null;

    const colum_defs = columns.map((key) => ({ key, header: key }));

    return (
      <Table
        className='table-container'
        data={queryResult}
        columns={colum_defs}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selection */}
      <section style={{
        fontSize: '0.95rem',
      }}>
        <h3 className="text-sm text-blue-400 mb-3">Time Range</h3>
        <div className="space-y-4">
          {/* Type Toggle */}
          <div className="flex items-center gap-4">
            <Radio
              label="Sliding Window"
              checked={timeRange.type === 'sliding'}
              onChange={() => handleTimeRangeTypeChange('sliding')}
            />
            <Radio
              style={{
                display: 'none'
              }}
              label="Fixed Range"
              checked={timeRange.type === 'fixed'}
              disabled={true} // Initially disabled
              onChange={() => handleTimeRangeTypeChange('fixed')}
            />
          </div>

          {/* Sliding Window Options */}
          {timeRange.type === 'sliding' && (

            <>
            <div className="grid grid-cols-3 gap-2">
              {[/*5,*/ 15, 60].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleSlidingWindowChange(minutes as 5 | 15 | 60)}
                  className={`p-2 rounded-lg border border-gray-800 transition-colors
                    ${timeRange.sliding?.minutes === minutes 
                      ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' 
                      : 'hover:border-purple-500/30'
                    }
                    disabled:bg-gray-900/20 
                    disabled:border-gray-800/50 
                    disabled:text-gray-600
                    disabled:cursor-not-allowed
                    disabled:hover:border-gray-800/50
                  `}
                  disabled={!enabledWindows.includes(minutes)}
                >
                  {minutes} min
                </button>
              ))}
            </div>
            {showBackTest && <div className="">
              <h3 className="text-sm text-blue-400 mb-3">Backtest</h3>
              <DateTimePicker
                value={
                 timeRange.sliding?.startBacktest
                 ? new Date(timeRange.sliding?.startBacktest)
                 : new Date(slidingDefaultDate)
                }
                onChange={(date) => {
                  handleSlidingWindowChange(timeRange.sliding?.minutes || 5, date.toISOString())
                  console.log('date selected', date)
                }}
                label="Start Date"
                minuteStep={timeRange.sliding?.minutes}
              />
            </div>
            }
            </>
          )}

          {/* Fixed Range Display */}
          {timeRange.type === 'fixed' && (
            <div className="flex gap-8 align-center flex-wrap">
              <DateTimePicker
                value={new Date('2024-12-28T12:00:00Z')}
                onChange={(date) => handleDateChange(date, 'start')}
                label="Start Date"
              />
              <DateTimePicker
                value={new Date('2024-12-28T12:05:00Z')}
                onChange={(date) => handleDateChange(date, 'start')}
                label="End Date"
              />
            </div>
          )}
        </div>
      </section>

      <div>
        <h3 className="text-sm text-blue-400 mb-3">Query Testing</h3>
        <div className="space-y-4">
          <textarea
            value={userQuery}
            onChange={(e) => handleChange('userQuery', e.target.value)}
            placeholder="SELECT * FROM swaps LIMIT 10"
            className="w-full h-32 bg-gray-900/50 p-3 rounded-lg border border-gray-800 font-mono text-sm"
            spellCheck={false}
          />
          {queryError &&
            <QueryError
              error={{ message: queryError }}
              onDismiss={() => setQueryError(undefined)}
            />
          }
          {!isActivated && <div style={{
            color: '#ff6b6b',
            fontSize: '0.75rem',
            padding: '0.15rem 0'
          }}>Account not activated</div>}
          <LoadingButton
            onClick={handleRunQuery}
            isLoading={runningQuery}
            loadingText="Running Query"
            icon={<Play size={14} />}
            style={styles.toolbarButton}
            disabled={!isActivated || runningQuery}
          > Run Query </LoadingButton>
          {queryResult && <div>
            <div style={{
              fontSize: '0.75rem',
              color: '#999',
              padding: '0.15rem 0'
            }}> 
            <div>{info}</div>
            Query finished in {
              queryDuration > 1000
                ? `${(queryDuration / 1000).toFixed(2)}s`
                : `${queryDuration.toFixed(3)}ms`
            } 
            <span style={{
              marginLeft: '0.5rem',
              color: '#666',
              fontSize: '0.75rem',
            }}>
              {queryResult.length || 0} results ( truncated to 1000 results ) 
            </span>
            </div>
            <div>{renderResultTable()}</div>
          </div>}
        </div>
      </div>
    </div>
  );
};
