import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, MoveUp, MoveDown, GripVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DataCollectionField } from '@/types/chatbot';

interface FieldSelectorProps {
  fields: DataCollectionField[];
  tables: { id: string; name: string; connectedTo?: string }[];
  availableFields: { id: string; name: string; type: string; object: string }[];
  onFieldsChange: (fields: DataCollectionField[]) => void;
  ensureEmailRequired?: boolean;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  tables,
  availableFields,
  onFieldsChange,
  ensureEmailRequired = false,
}) => {
  const [selectedTable, setSelectedTable] = useState(tables[0]?.id || '');

  const handleAddField = () => {
    // Filter available fields to exclude already selected ones
    const selectedFieldIds = fields.map(f => f.id);
    const availableForSelection = availableFields
      .filter(field => !selectedFieldIds.includes(field.id) && field.object === selectedTable);
    
    if (availableForSelection.length === 0) return;
    
    // Add the first available field
    const newField = {
      id: availableForSelection[0].id,
      label: availableForSelection[0].name,
      type: availableForSelection[0].type as any,
      required: false
    };
    
    onFieldsChange([...fields, newField]);
  };

  const handleRemoveField = (index: number) => {
    // Check if this is the email field and we need to keep it
    const fieldToRemove = fields[index];
    if (ensureEmailRequired && fieldToRemove.id === 'contact_email') {
      return; // Don't remove required email field
    }
    
    const newFields = [...fields];
    newFields.splice(index, 1);
    onFieldsChange(newFields);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }
    
    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFields[index];
    newFields[index] = newFields[newIndex];
    newFields[newIndex] = temp;
    
    onFieldsChange(newFields);
  };

  const handleToggleRequired = (index: number) => {
    // If this is the email field and ensureEmailRequired is true, don't allow disabling required
    if (ensureEmailRequired && fields[index].id === 'contact_email' && fields[index].required) {
      return;
    }
    
    const newFields = [...fields];
    newFields[index] = {
      ...newFields[index],
      required: !newFields[index].required
    };
    
    onFieldsChange(newFields);
  };

  const getFieldDisplayName = (fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId);
    return field ? field.name : fieldId;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Fields to collect from users</h3>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleAddField}
        >
          <Plus className="h-4 w-4" />
          <span>Add Field</span>
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-gray-500 py-2">
          No fields selected. Add fields to collect user information.
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
              <div className="cursor-move">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-sm">{getFieldDisplayName(field.id)}</div>
                <div className="text-xs text-gray-500">{field.type}</div>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="flex items-center mr-2">
                  <Switch
                    id={`required-${index}`}
                    checked={field.required}
                    onCheckedChange={() => handleToggleRequired(index)}
                    disabled={ensureEmailRequired && field.id === 'contact_email' && field.required}
                  />
                  <Label htmlFor={`required-${index}`} className="ml-2 text-xs">
                    Required
                  </Label>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveField(index, 'up')}
                  disabled={index === 0}
                  className="h-8 w-8"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveField(index, 'down')}
                  disabled={index === fields.length - 1}
                  className="h-8 w-8"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveField(index)}
                  disabled={ensureEmailRequired && field.id === 'contact_email'}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
