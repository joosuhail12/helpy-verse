
import React from 'react';

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <div className="space-y-2">
      <label 
        htmlFor="email" 
        className="block text-gray-700 font-medium text-sm transition-colors duration-300"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        placeholder="hello@example.com"
        className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-gray-200 
                 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 
                 hover:border-primary/30 transition-all duration-300 ease-in-out
                 placeholder:text-gray-400 text-gray-800"
        required
        disabled={disabled}
        autoComplete="email"
      />
    </div>
  );
};
