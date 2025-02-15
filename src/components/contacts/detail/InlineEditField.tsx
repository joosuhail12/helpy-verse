
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CustomFieldType } from '@/types/customField';
import { validateFieldValue } from '@/components/settings/customData/utils/fieldValidation';
import { Textarea } from '@/components/ui/textarea';

interface InlineEditFieldProps {
  value: string | number | boolean;
  contactId: string;
  field: string;
  label: string;
  type?: CustomFieldType;
  options?: string[];
  validation?: {
    type: 'required' | 'minLength' | 'maxLength' | 'regex' | 'min' | 'max';
    value: string | number;
    message: string;
  }[];
}

export const InlineEditField = ({
  value,
  contactId,
  field,
  label,
  type = 'text',
  options = [],
  validation = []
}: InlineEditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string | number | boolean>(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    // Validate the field based on its type and validation rules
    const mockField = {
      id: field,
      name: label,
      type,
      required: validation.some(v => v.type === 'required'),
      validationRules: validation,
      description: ''
    };

    const validationErrors = validateFieldValue(editValue, mockField);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      toast({
        title: 'Validation Error',
        description: validationErrors[0],
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await dispatch(updateContact({ id: contactId, [field]: editValue }));
      setIsEditing(false);
      toast({
        title: 'Success',
        description: `${label} has been updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update ${label.toLowerCase()}.`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setError(null);
  };

  const renderEditField = () => {
    switch (type) {
      case 'boolean':
        return (
          <Switch
            checked={Boolean(editValue)}
            onCheckedChange={(checked) => setEditValue(checked)}
            disabled={isSaving}
          />
        );

      case 'select':
        return (
          <Select value={String(editValue)} onValueChange={(val) => setEditValue(val)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-select':
        return (
          <Select
            value={String(editValue)}
            onValueChange={(val) => setEditValue(val)}
            multiple
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rich-text':
        return (
          <Textarea
            value={String(editValue)}
            onChange={(e) => setEditValue(e.target.value)}
            className="min-h-[100px]"
            disabled={isSaving}
          />
        );

      case 'currency':
        return (
          <Input
            ref={inputRef}
            type="number"
            step="0.01"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8"
            disabled={isSaving}
          />
        );

      default:
        return (
          <Input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8"
            disabled={isSaving}
          />
        );
    }
  };

  const renderDisplayValue = () => {
    switch (type) {
      case 'boolean':
        return String(value) === 'true' ? 'Yes' : 'No';
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value) || 0);
      case 'multi-select':
        return Array.isArray(value) ? value.join(', ') : value;
      default:
        return value;
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {renderEditField()}
          <div className="flex items-center space-x-2">
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
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      <span className="min-w-[100px] py-1 px-2 rounded transition-colors group-hover:bg-gray-100">
        {renderDisplayValue()}
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
