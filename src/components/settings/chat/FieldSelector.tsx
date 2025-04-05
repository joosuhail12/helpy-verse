
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DataCollectionField } from '@/types/chatbot';

interface FieldSelectorProps {
  fields: DataCollectionField[];
  availableFields: Array<{
    id: string;
    name: string;
    type: string;
    object: string;
  }>;
  tables: Array<{
    id: string;
    name: string;
    connectedTo?: string;
  }>;
  onFieldsChange: (fields: DataCollectionField[]) => void;
  ensureEmailRequired?: boolean;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  availableFields,
  tables,
  onFieldsChange,
  ensureEmailRequired = false,
}) => {
  const [isAddingField, setIsAddingField] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [selectedFieldLabel, setSelectedFieldLabel] = useState('');
  const [isRequiredField, setIsRequiredField] = useState(false);
  const [activeTable, setActiveTable] = useState(tables[0]?.id || '');

  const handleAddField = () => {
    if (!selectedFieldId) return;
    
    const fieldType = availableFields.find(f => f.id === selectedFieldId)?.type || 'text';
    
    const newField: DataCollectionField = {
      id: selectedFieldId,
      label: selectedFieldLabel || availableFields.find(f => f.id === selectedFieldId)?.name || '',
      type: fieldType as 'text' | 'email' | 'phone' | 'select',
      required: isRequiredField
    };
    
    const updatedFields = [...fields, newField];
    onFieldsChange(updatedFields);
    
    // Reset form
    setIsAddingField(false);
    setSelectedFieldId('');
    setSelectedFieldLabel('');
    setIsRequiredField(false);
  };

  const handleRemoveField = (fieldId: string) => {
    // Don't allow removing email field if ensureEmailRequired is true
    if (ensureEmailRequired && fieldId === 'contact_email') {
      return;
    }
    
    const updatedFields = fields.filter(field => field.id !== fieldId);
    onFieldsChange(updatedFields);
  };

  const handleToggleRequired = (fieldId: string) => {
    // Don't allow toggling email field if ensureEmailRequired is true
    if (ensureEmailRequired && fieldId === 'contact_email') {
      return;
    }
    
    const updatedFields = fields.map(field => {
      if (field.id === fieldId) {
        return { ...field, required: !field.required };
      }
      return field;
    });
    
    onFieldsChange(updatedFields);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedFields = [...fields];
    const field = updatedFields[index];
    
    updatedFields.splice(index, 1);
    updatedFields.splice(newIndex, 0, field);
    
    onFieldsChange(updatedFields);
  };

  // Filter available fields to exclude already selected ones
  const filteredAvailableFields = availableFields.filter(
    field => !fields.find(f => f.id === field.id) && 
    field.object === activeTable.split('_')[0]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Data Collection Fields</h3>
        <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Data Collection Field</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="dataObject">Data Object</Label>
                <Select 
                  value={activeTable} 
                  onValueChange={setActiveTable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data object" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map(table => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldSelect">Select Field</Label>
                <Select 
                  value={selectedFieldId} 
                  onValueChange={setSelectedFieldId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a field" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAvailableFields.map(field => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name}
                      </SelectItem>
                    ))}
                    {filteredAvailableFields.length === 0 && (
                      <SelectItem value="no-fields" disabled>
                        No fields available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldLabel">Display Label (optional)</Label>
                <Input
                  id="fieldLabel"
                  placeholder="Enter custom label"
                  value={selectedFieldLabel}
                  onChange={(e) => setSelectedFieldLabel(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use the default field name
                </p>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="required"
                  checked={isRequiredField}
                  onCheckedChange={() => setIsRequiredField(!isRequiredField)}
                />
                <Label htmlFor="required" className="text-sm font-normal">
                  Make this field required
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingField(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddField} disabled={!selectedFieldId}>
                Add Field
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-md">
          <p className="text-sm text-gray-500">
            No data collection fields defined yet.
          </p>
          <Button 
            variant="link" 
            size="sm" 
            className="mt-2"
            onClick={() => setIsAddingField(true)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add your first field
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <Badge variant={field.required ? "default" : "outline"} className="h-6">
                  {field.required ? "Required" : "Optional"}
                </Badge>
                <span>{field.label}</span>
                <span className="text-xs text-gray-500">({field.type})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleRequired(field.id)}
                  disabled={ensureEmailRequired && field.id === 'contact_email'}
                >
                  {field.required ? "Make Optional" : "Make Required"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveField(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveField(index, 'down')}
                  disabled={index === fields.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemoveField(field.id)}
                  disabled={ensureEmailRequired && field.id === 'contact_email'}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldSelector;
