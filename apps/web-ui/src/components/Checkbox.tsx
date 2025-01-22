import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="peer sr-only"
          {...props}
        />
        <div className="h-4 w-4 border border-gray-800 rounded bg-gray-900/50 peer-checked:border-purple-500 peer-checked:bg-purple-500/20 transition-all" />
        <Check 
          size={12} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 opacity-0 peer-checked:opacity-100 transition-opacity"
        />
      </div>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  );
};

export default Checkbox;