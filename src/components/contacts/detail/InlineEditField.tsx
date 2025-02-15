
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/components/ui/use-toast';

interface InlineEditFieldProps {
  value: string;
  contactId: string;
  field: keyof Contact;
  label: string;
}

export const InlineEditField = ({ value, contactId, field, label }: InlineEditFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleSave = () => {
    dispatch(updateContact({ id: contactId, [field]: editValue }));
    setIsEditing(false);
    toast({
      title: "Contact updated",
      description: `${label} has been updated successfully.`,
    });
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-8"
          autoFocus
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditValue(value);
            setIsEditing(false);
          }}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>{value}</span>
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
