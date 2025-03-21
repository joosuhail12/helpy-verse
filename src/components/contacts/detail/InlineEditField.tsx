
import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export interface InlineEditFieldProps {
  value: string;
  contactId: string;
  label: string;
  fieldName?: string; // New prop for backward compatibility
  field?: string;     // Keep for backward compatibility
  type?: 'text' | 'date' | 'select' | 'email' | 'phone' | 'url';
  options?: Array<{ value: string; label: string }> | string[];
  onSave?: (value: string) => void;
  validation?: Record<string, any>;
}

export const InlineEditField = ({ 
  value, 
  contactId, 
  label, 
  fieldName, 
  field,
  type = 'text',
  options,
  onSave 
}: InlineEditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  // Use the fieldName if provided, otherwise fallback to field for backward compatibility
  const actualFieldName = fieldName || field || label.toLowerCase();

  useOnClickOutside(wrapperRef, () => {
    if (isEditing) {
      handleCancel();
    }
  });

  useEffect(() => {
    if (isEditing) {
      if (type === 'select' && selectRef.current) {
        selectRef.current.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isEditing, type]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    try {
      // Create an update object dynamically based on field name
      const updateData: Record<string, string> = {};
      updateData[actualFieldName] = editValue;

      await dispatch(updateContact({
        contactId,
        data: updateData
      }));

      if (onSave) {
        onSave(editValue);
      }
    } catch (error) {
      console.error('Failed to update field:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const renderInput = () => {
    switch(type) {
      case 'select':
        return (
          <select 
            ref={selectRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border rounded px-2 py-1"
          >
            {Array.isArray(options) && options.map((option, index) => {
              if (typeof option === 'string') {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              } else {
                return (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                );
              }
            })}
          </select>
        );
      case 'date':
        return (
          <Input
            ref={inputRef}
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        );
      default:
        return (
          <Input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        );
    }
  };

  return (
    <div ref={wrapperRef} className="group relative w-full">
      {isEditing ? (
        <div className="flex w-full gap-2">
          {renderInput()}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className={`block ${!value ? 'text-muted-foreground italic' : ''}`}>
            {value || 'Not set'}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
