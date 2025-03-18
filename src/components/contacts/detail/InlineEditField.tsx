
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

interface InlineEditFieldProps {
  label: string;
  value: string | null | undefined;
  fieldName: string;
  contactId: string;
  type?: 'text' | 'select' | 'date';
  options?: Array<{ value: string; label: string }>;
}

export const InlineEditField: React.FC<InlineEditFieldProps> = ({
  label,
  value,
  fieldName,
  contactId,
  type = 'text',
  options = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }
    
    setIsLoading(true);
    try {
      await dispatch(updateContact({
        contactId,
        data: { [fieldName]: editValue }
      })).unwrap();
      
      toast({
        title: "Updated",
        description: `Successfully updated ${label.toLowerCase()}`,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${label.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderEditMode = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            value={editValue}
            onValueChange={setEditValue}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'date':
        return (
          <Input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            disabled={isLoading}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        );
    }
  };
  
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      
      {isEditing ? (
        <div className="space-y-2">
          {renderEditMode()}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={isLoading}
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center group">
          <div className="font-medium">
            {value ? (
              type === 'date' && value 
                ? new Date(value).toLocaleDateString() 
                : value
            ) : (
              <span className="text-muted-foreground italic">Not set</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
