
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import type { DataCollectionField } from '@/types/chatbot';

const AVAILABLE_CUSTOMER_FIELDS = [
  { id: 'firstName', label: 'First Name', type: 'text' },
  { id: 'lastName', label: 'Last Name', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'phone', label: 'Phone Number', type: 'phone' },
  { id: 'company', label: 'Company Name', type: 'text' },
] as const;

interface DataCollectionConfigProps {
  enabled: boolean;
  fields: DataCollectionField[];
  onEnableChange: (enabled: boolean) => void;
  onFieldsChange: (fields: DataCollectionField[]) => void;
}

export function DataCollectionConfig({
  enabled,
  fields,
  onEnableChange,
  onFieldsChange,
}: DataCollectionConfigProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');

  const addField = () => {
    if (!selectedFieldId) return;
    
    const fieldToAdd = AVAILABLE_CUSTOMER_FIELDS.find(f => f.id === selectedFieldId);
    if (!fieldToAdd) return;

    // Check if field is already added
    if (fields.some(f => f.id === selectedFieldId)) return;

    const newField: DataCollectionField = {
      id: fieldToAdd.id,
      label: fieldToAdd.label,
      type: fieldToAdd.type,
      required: false,
    };
    onFieldsChange([...fields, newField]);
    setSelectedFieldId('');
  };

  const removeField = (id: string) => {
    onFieldsChange(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<DataCollectionField>) => {
    onFieldsChange(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const availableFields = AVAILABLE_CUSTOMER_FIELDS.filter(
    field => !fields.some(f => f.id === field.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable Data Collection</Label>
          <p className="text-sm text-gray-500">
            Select which customer information to collect before starting a chat
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnableChange} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label>Add Customer Field</Label>
              <Select 
                value={selectedFieldId} 
                onValueChange={setSelectedFieldId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a field to add" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="button" 
              onClick={addField} 
              className="mb-0.5"
              disabled={!selectedFieldId}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Label>{field.label}</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                      />
                      <Label>Required</Label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Type: {field.type}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeField(field.id)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
