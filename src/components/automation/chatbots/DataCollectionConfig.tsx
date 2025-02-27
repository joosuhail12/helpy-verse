
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
import { PlusCircle, X, Mail, User, Phone, Building2, AlertCircle } from "lucide-react";
import type { DataCollectionField } from '@/types/chatbot';

const AVAILABLE_CUSTOMER_FIELDS = [
  { 
    id: 'firstname', 
    label: 'First Name', 
    type: 'text',
    description: 'Visitor\'s first name',
    icon: User
  },
  { 
    id: 'lastname', 
    label: 'Last Name', 
    type: 'text',
    description: 'Visitor\'s last name',
    icon: User
  },
  { 
    id: 'email', 
    label: 'Email', 
    type: 'email',
    description: 'Contact email address',
    icon: Mail
  },
  { 
    id: 'phone', 
    label: 'Phone Number', 
    type: 'phone',
    description: 'Contact phone number',
    icon: Phone
  },
  { 
    id: 'company', 
    label: 'Company Name', 
    type: 'text',
    description: 'Organization or company name',
    icon: Building2
  },
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
          <Label className="text-base">Enable Data Collection</Label>
          <p className="text-sm text-gray-500">
            Collect visitor information before starting a chat
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnableChange} />
      </div>

      {enabled && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
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
                      <SelectItem 
                        key={field.id} 
                        value={field.id}
                        className="flex items-center gap-2"
                      >
                        <field.icon className="h-4 w-4 text-gray-500" />
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="button" 
                onClick={addField} 
                disabled={!selectedFieldId}
                className="mb-0.5"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {fields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  No fields added yet. Add fields to collect information from visitors.
                </p>
              </div>
            )}

            {fields.map((field) => {
              const fieldConfig = AVAILABLE_CUSTOMER_FIELDS.find(f => f.id === field.id);
              if (!fieldConfig) return null;

              return (
                <div 
                  key={field.id} 
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-1">
                    <fieldConfig.icon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">{field.label}</Label>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {fieldConfig.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                          />
                          <Label className="text-sm">Required</Label>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeField(field.id)}
                          className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        Type: {field.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

