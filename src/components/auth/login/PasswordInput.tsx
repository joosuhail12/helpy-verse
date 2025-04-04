
import React from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <div className="space-y-2">
      <label 
        htmlFor="password" 
        className="block text-gray-700 font-medium text-sm transition-colors duration-300"
      >
        Password
      </label>
      <input
        id="password"
        type="password"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-gray-200 
                 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 
                 hover:border-primary/30 transition-all duration-300 ease-in-out
                 placeholder:text-gray-400 text-gray-800"
        required
        disabled={disabled}
        autoComplete="current-password"
      />
    </div>
  );
};
