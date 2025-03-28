
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { EditField } from '@/components/contacts/detail/inline-edit/EditField';
import { Check, X, Pencil } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateCompany } from '@/store/slices/companies/companiesSlice';
import { toast } from '@/hooks/use-toast';
import { Company } from '@/types/company';
import { CustomFieldType } from '@/types/customField';

interface InlineEditFieldProps {
  value: string | number | boolean | string[];
  company: Company;
  field: string;
  label: string;
  type?: CustomFieldType;
  options?: string[];
}

export const InlineEditField = ({
  value,
  company,
  field,
  label,
  type = 'text',
  options = [],
}: InlineEditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setEditValue(value);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const saveChanges = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      // Create a data object with just the field being updated
      const data: Partial<Company> = {};
      data[field as keyof Company] = editValue as any;

      await dispatch(updateCompany({
        companyId: company.id,
        data
      }));

      toast({
        title: 'Field updated',
        description: `${label} has been updated successfully.`,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update field. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <EditField
              type={type}
              value={editValue}
              onChange={setEditValue}
              options={options}
              isSaving={isSaving}
              inputRef={inputRef}
              field={field}
            />
          </div>
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={saveChanges}
              disabled={isSaving}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={cancelEditing}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="group flex items-center gap-2">
          <div className="flex-1 py-1 px-2 text-sm rounded-md group-hover:bg-muted/50">
            {value === '' || value === undefined || value === null ? (
              <span className="text-muted-foreground italic">Not set</span>
            ) : Array.isArray(value) ? (
              value.join(', ')
            ) : (
              String(value)
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={startEditing}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
