
import React, { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateCompany } from '@/store/slices/companies/companiesSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';

export interface InlineEditFieldProps {
  value: string;
  company: string;  // Company ID
  field: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'phone' | 'url' | 'rich-text';
  validation?: Array<{ type: string; value: string; message: string }>;
}

export const InlineEditField = ({
  value,
  company,
  field,
  label,
  type = 'text',
  validation = [],
}: InlineEditFieldProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(value);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value);
    setError('');
  };

  const validateInput = (): boolean => {
    for (const rule of validation) {
      if (rule.type === 'required' && !inputValue) {
        setError(rule.message);
        return false;
      }
      if (rule.type === 'regex' && !new RegExp(rule.value).test(inputValue)) {
        setError(rule.message);
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateInput()) {
      return;
    }

    dispatch(
      updateCompany({
        companyId: company,
        data: {
          [field]: inputValue,
        },
      })
    );
    setIsEditing(false);
    setError('');
  };

  const renderInput = () => {
    if (type === 'rich-text') {
      return (
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`w-full ${error ? 'border-red-500' : ''}`}
          rows={4}
        />
      );
    }

    return (
      <Input
        type={type}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`w-full ${error ? 'border-red-500' : ''}`}
      />
    );
  };

  return (
    <div className="mb-4 group">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm text-muted-foreground">{label}</label>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleEdit}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          {renderInput()}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave}>
              <CheckIcon className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <XIcon className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-[24px] py-1">
          {value ? value : <span className="text-muted-foreground italic">Not set</span>}
        </div>
      )}
    </div>
  );
};
