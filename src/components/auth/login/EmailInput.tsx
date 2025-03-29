
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  disabled
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
        Email
      </Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        placeholder="hello@example.com"
        disabled={disabled}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
      />
    </div>
  );
};
