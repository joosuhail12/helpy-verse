
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '@/types/contact';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface InlineEditFieldProps {
  value: string;
  contactId: string;
  field: string;
  label: string;
  autoSave?: boolean;
}

export const InlineEditField = ({ 
  value, 
  contactId, 
  field, 
  label,
  autoSave = true
}: InlineEditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(editValue, 1000);

  useEffect(() => {
    if (autoSave && debouncedValue !== value) {
      handleSave();
    }
  }, [debouncedValue]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(updateContact({ id: contactId, [field]: editValue }));
      setSaveComplete(true);
      setTimeout(() => setSaveComplete(false), 1500);
      toast({
        title: "Saved",
        description: `${label} has been updated.`,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${label.toLowerCase()}.`,
        variant: "destructive",
      });
      setEditValue(value);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-8"
          disabled={isSaving}
        />
        {!autoSave && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
        {autoSave && isSaving && (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        )}
        {autoSave && saveComplete && (
          <Check className="h-4 w-4 text-green-500 animate-scale-in" />
        )}
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      <span className="min-w-[100px] py-1 px-2 rounded transition-colors group-hover:bg-gray-100">
        {value}
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-4 w-4 text-gray-500" />
      </Button>
    </div>
  );
};

