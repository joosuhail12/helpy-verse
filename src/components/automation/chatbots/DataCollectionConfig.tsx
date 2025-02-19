
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [newFieldType, setNewFieldType] = useState<DataCollectionField['type']>('text');

  const addField = () => {
    const newField: DataCollectionField = {
      id: Date.now().toString(),
      label: '',
      type: newFieldType,
      required: false,
    };
    onFieldsChange([...fields, newField]);
  };

  const removeField = (id: string) => {
    onFieldsChange(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<DataCollectionField>) => {
    onFieldsChange(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable Data Collection</Label>
          <p className="text-sm text-gray-500">
            Collect information from unauthenticated users before starting a chat
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnableChange} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label>Field Type</Label>
              <Select value={newFieldType} onValueChange={(value: DataCollectionField['type']) => setNewFieldType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={addField} className="mb-0.5">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-1 space-y-4">
                  <div>
                    <Label>Field Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Enter field label"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label>Field Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value: DataCollectionField['type']) => 
                          updateField(field.id, { type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                      />
                      <Label>Required</Label>
                    </div>
                  </div>
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
