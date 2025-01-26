import React from 'react';

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Radio: React.FC<RadioProps> = ({ label, className = '', disabled, style, ...props }) => {
  return (
    <label 
      style={{
        ...style
      }}
      className={`flex items-center gap-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <div
        className={`relative inline-flex items-center justify-center w-4 h-4 rounded-full 
                   border ${props.checked ? 'border-purple-500' : 'border-gray-800'} 
                   bg-gray-900/50 transition-colors`}
      >
        <input
          type="radio"
          className="absolute opacity-0 w-full h-full cursor-pointer"
          disabled={disabled}
          {...props}
        />
        {/* Fill circle */}
        <div
          className={`w-2 h-2 rounded-full bg-purple-500 
                     ${props.checked ? 'opacity-100' : 'opacity-0'} 
                     transition-opacity`}
        />
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Radio;