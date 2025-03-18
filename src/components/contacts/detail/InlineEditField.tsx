
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

export interface InlineEditFieldProps {
  value: string;
  contactId: string;
  fieldName: string;
  label: string;
  type?: 'text' | 'date' | 'select';
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

export const InlineEditField = ({ 
  value, 
  contactId, 
  fieldName, 
  label,
  type = 'text',
  options = [],
  disabled = false
}: InlineEditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(updateContact({ 
        contactId, 
        data: { [fieldName]: editValue } 
      })).unwrap();
      
      setIsEditing(false);
      toast({
        title: "Updated Successfully",
        description: `${label} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred while updating the field.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        {type === 'select' && options.length > 0 ? (
          <select 
            value={editValue} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Input 
            type={type === 'date' ? 'date' : 'text'} 
            value={editValue} 
            onChange={handleChange} 
            autoFocus
          />
        )}
        <Button 
          variant="ghost"
          size="icon"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="group flex items-center space-x-2 py-1" 
      onClick={handleEdit}
    >
      <p className="text-base">{value || '-'}</p>
      {!disabled && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
