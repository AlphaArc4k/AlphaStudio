import React from 'react';
import { format } from "date-fns";
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  minuteStep?: number;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  label,
  minuteStep = 1
}) => {
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    // Preserve the current time when changing the date
    const newDate = new Date(date);
    newDate.setHours(value.getHours());
    newDate.setMinutes(value.getMinutes());
    onChange(newDate);
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    const newDate = new Date(value);
    if (type === 'hours') {
      newDate.setHours(parseInt(val));
    } else {
      newDate.setMinutes(parseInt(val));
    }
    onChange(newDate);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex-1 flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-purple-500/50">
              <CalendarIcon className="h-4 w-4" />
              <span className="flex-1 text-left">
                {format(value, 'yyyy-MM-dd')}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1a1b26] border border-gray-800" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateChange}
              initialFocus
              className="bg-[#1a1b26]"
              classNames={{
                months: "space-y-4",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-gray-300",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-300",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-800/50 [&:has([aria-selected])]:bg-gray-800/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-gray-300",
                day_range_end: "day-range-end",
                day_selected: "bg-purple-500 text-gray-50 hover:bg-purple-400 hover:text-gray-50 focus:bg-purple-500 focus:text-gray-50",
                day_today: "bg-gray-800 text-gray-50",
                day_outside: "day-outside opacity-50 aria-selected:bg-gray-800/50 aria-selected:text-gray-50 aria-selected:opacity-30",
                day_disabled: "text-gray-500",
                day_hidden: "invisible",
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="flex gap-1">
          <input
            type="number"
            min="0"
            max="23"
            placeholder="HH"
            className="w-16 p-2 bg-gray-900/50 rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500/50"
            value={format(value, 'HH')}
            onChange={(e) => {
              const hours = e.target.value.padStart(2, '0');
              handleTimeChange('hours', hours);
            }}
          />
          <span className="flex items-center text-gray-400">:</span>
          <input
            type="number"
            min="0"
            max="59"
            step={minuteStep}
            placeholder="MM"
            className="w-16 p-2 bg-gray-900/50 rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500/50"
            value={format(value, 'mm')}
            onChange={(e) => {
              const minutes = e.target.value.padStart(2, '0');
              handleTimeChange('minutes', minutes);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;