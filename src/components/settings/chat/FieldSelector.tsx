import React from 'react';
import { Trash2, MoveUp, MoveDown, GripVertical, ListFilter, Database } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { DataCollectionField } from '@/types/chatbot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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

  const getFieldObjectName = (fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId);
    if (!field) return '';
    
    const table = tables.find(t => t.id === field.object);
    return table ? table.name : field.object;
  };

  // Group fields by their object type for better organization
  const fieldsByTable = fields.reduce((acc, field) => {
    const fieldInfo = availableFields.find(f => f.id === field.id);
    const tableId = fieldInfo?.object || 'unknown';
    
    if (!acc[tableId]) {
      acc[tableId] = [];
    }
    
    acc[tableId].push(field);
    return acc;
  }, {} as Record<string, DataCollectionField[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Selected Fields</h3>
          <Badge variant="outline" className="text-xs">
            {fields.length} {fields.length === 1 ? 'field' : 'fields'}
          </Badge>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-gray-500 py-2 border-2 border-dashed border-gray-200 rounded-md p-6 text-center">
          <ListFilter className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <p>No fields selected. Add fields to collect user information.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(fieldsByTable).map(([tableId, tableFields]) => {
            const tableName = tables.find(t => t.id === tableId)?.name || tableId;
            
            return (
              <div key={tableId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-500" />
                  <h4 className="text-sm font-medium">{tableName}</h4>
                </div>
                
                <div className="pl-6 space-y-2">
                  {tableFields.map((field, fieldIndex) => {
                    const index = fields.findIndex(f => f.id === field.id);
                    
                    return (
                      <div key={field.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                        <div className="cursor-move">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-sm">{getFieldDisplayName(field.id)}</div>
                          <div className="text-xs text-gray-500">
                            <Badge variant="outline" className="text-[10px] py-0 h-4">
                              {field.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <div className="flex items-center mr-2">
                            <Switch
                              id={`required-${index}`}
                              checked={field.required}
                              onCheckedChange={() => handleToggleRequired(index)}
                              disabled={ensureEmailRequired && field.id === 'contact_email' && field.required}
                              className="scale-90"
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
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
