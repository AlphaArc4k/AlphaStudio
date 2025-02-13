import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import BaseTrigger from './BaseTrigger';

interface ScheduleTriggerProps {
  isEnabled?: boolean;
  error?: string;
  onSave: (schedule: string) => void;
}

const ScheduleTrigger: React.FC<ScheduleTriggerProps> = ({
  isEnabled,
  error,
  onSave
}) => {
  const [scheduleType, setScheduleType] = useState<'fixed' | 'interval'>('fixed');
  const [time, setTime] = useState('');
  const [interval, setInterval] = useState('');
  const [intervalUnit, setIntervalUnit] = useState<'minutes' | 'hours' | 'days'>('hours');

  return (
    <BaseTrigger
      title="Schedule Trigger"
      description="Trigger agent at fixed times or intervals"
      icon={<Clock size={16} className="text-purple-400" />}
      isEnabled={isEnabled}
      error={error}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setScheduleType('fixed')}
            className={`flex-1 px-3 py-1.5 rounded text-sm ${
              scheduleType === 'fixed'
                ? 'bg-purple-500'
                : 'bg-gray-900/50'
            }`}
          >
            Fixed Time
          </button>
          <button
            onClick={() => setScheduleType('interval')}
            className={`flex-1 px-3 py-1.5 rounded text-sm ${
              scheduleType === 'interval'
                ? 'bg-purple-500'
                : 'bg-gray-900/50'
            }`}
          >
            Interval
          </button>
        </div>

        {scheduleType === 'fixed' ? (
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-900/50 rounded border border-gray-800 text-sm"
          />
        ) : (
          <div className="flex gap-2">
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              min="1"
              className="w-20 px-3 py-1.5 bg-gray-900/50 rounded border border-gray-800 text-sm"
            />
            <select
              value={intervalUnit}
              onChange={(e) => setIntervalUnit(e.target.value as any)}
              className="flex-1 px-3 py-1.5 bg-gray-900/50 rounded border border-gray-800 text-sm"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        )}
      </div>
    </BaseTrigger>
  );
};

export default ScheduleTrigger;