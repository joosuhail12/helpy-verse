
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, X, Mail, User, Phone, Building2, AlertCircle } from "lucide-react";
import type { DataCollectionField } from '@/types/chatbot';

interface TableInfo {
  id: string;
  name: string;
  connectedTo?: string;
}

interface FieldInfo {
  id: string;
  name: string;
  type: string;
  object: string;
}

interface FieldSelectorProps {
  fields: DataCollectionField[];
  tables: TableInfo[];
  availableFields: FieldInfo[];
  onFieldsChange: (fields: DataCollectionField[]) => void;
  ensureEmailRequired?: boolean;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  tables,
  availableFields,
  onFieldsChange,
  ensureEmailRequired = true
}) => {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");
  
  // Filtered fields based on the selected table
  const filteredFields = availableFields.filter(field => {
    if (!selectedTable) return false;
    
    if (selectedTable === 'contacts') {
      return field.object === 'contact';
    } else if (selectedTable === 'companies') {
      return field.object === 'company';
    } else {
      // For custom objects, match by id prefix or other criteria
      const customTable = tables.find(table => table.id === selectedTable);
      if (customTable?.connectedTo === 'contacts') {
        return field.object === 'contact';
      } else if (customTable?.connectedTo === 'companies') {
        return field.object === 'company';
      }
      return false;
    }
  });

  // Fields that are available to add (not already added)
  const availableToAdd = filteredFields.filter(
    field => !fields.some(f => f.id === field.id)
  );

  const addField = () => {
    if (!selectedFieldId) return;
    
    const fieldToAdd = availableFields.find(f => f.id === selectedFieldId);
    if (!fieldToAdd) return;

    if (fields.some(f => f.id === selectedFieldId)) return;

    // Map the field type to one of the allowed types
    let fieldType: "text" | "email" | "phone" | "select" = "text";
    if (fieldToAdd.type === 'email') fieldType = "email";
    else if (fieldToAdd.type === 'phone') fieldType = "phone";
    else if (fieldToAdd.type === 'select') fieldType = "select";

    const newField: DataCollectionField = {
      id: fieldToAdd.id,
      label: fieldToAdd.name,
      type: fieldType,
      required: fieldToAdd.id === 'contact_email' || false,
    };
    
    onFieldsChange([...fields, newField]);
    setSelectedFieldId('');
  };

  const removeField = (id: string) => {
    // If email field is being removed and ensureEmailRequired is true, skip removal
    if (id === 'contact_email' && ensureEmailRequired) {
      toast({
        title: "Cannot remove email field",
        description: "The email field is required for data collection.",
        variant: "destructive"
      });
      return;
    }
    
    onFieldsChange(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<DataCollectionField>) => {
    // If trying to make email not required and ensureEmailRequired is true, skip update
    if (id === 'contact_email' && updates.required === false && ensureEmailRequired) {
      return;
    }
    
    onFieldsChange(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  // Get icon for a field based on its type
  const getFieldIcon = (fieldId: string) => {
    if (fieldId.includes('email')) return Mail;
    if (fieldId.includes('phone')) return Phone;
    if (fieldId.includes('company')) return Building2;
    return User;
  };

  // Get table name by id
  const getTableName = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    return table ? table.name : tableId;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-medium">Configure Data Collection Fields</h3>
      
      <div className="rounded-lg border border-gray-200 p-4 bg-white">
        <div className="flex items-end gap-4 mb-4">
          <div className="flex-1">
            <Label className="mb-2 block">Select Data Source</Label>
            <Select 
              value={selectedTable} 
              onValueChange={(value) => {
                setSelectedTable(value);
                setSelectedFieldId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedTable && (
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label className="mb-2 block">Select Field to Add</Label>
              <Select 
                value={selectedFieldId} 
                onValueChange={setSelectedFieldId}
                disabled={!selectedTable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  {availableToAdd.length === 0 ? (
                    <SelectItem value="none" disabled>No fields available</SelectItem>
                  ) : (
                    availableToAdd.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="button" 
              onClick={addField} 
              disabled={!selectedFieldId || !selectedTable}
              className="mb-0.5"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Selected Fields</h4>
        
        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              No fields added yet. Add fields to collect information from visitors.
            </p>
          </div>
        )}

        {fields.map((field) => {
          const FieldIcon = getFieldIcon(field.id);
          const fieldInfo = availableFields.find(f => f.id === field.id);
          const tableName = fieldInfo ? 
            (fieldInfo.object === 'contact' ? 'Contacts' : 
             fieldInfo.object === 'company' ? 'Companies' : 'Custom') : 
            'Unknown';
          
          return (
            <div 
              key={field.id} 
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mt-1">
                <FieldIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{field.label}</Label>
                    <p className="text-sm text-gray-500 mt-0.5">
                      From {tableName} table
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        disabled={field.id === 'contact_email' && ensureEmailRequired}
                      />
                      <Label className="text-sm">Required</Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(field.id)}
                      className="h-8 w-8 text-gray-500 hover:text-gray-700"
                      disabled={field.id === 'contact_email' && ensureEmailRequired}
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
  );
};
