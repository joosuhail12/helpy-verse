
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DataCollectionField } from '@/types/chatbot';
import { FieldSelector } from '@/components/settings/chat/FieldSelector';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock data for available fields - in a real implementation, this would be fetched from the API
const AVAILABLE_FIELDS = [
  // Contact fields
  { id: 'contact_firstname', name: 'First Name', type: 'text', object: 'contact' },
  { id: 'contact_lastname', name: 'Last Name', type: 'text', object: 'contact' },
  { id: 'contact_email', name: 'Email', type: 'email', object: 'contact' },
  { id: 'contact_phone', name: 'Phone Number', type: 'phone', object: 'contact' },
  { id: 'contact_company', name: 'Company', type: 'text', object: 'contact' },
  { id: 'contact_jobTitle', name: 'Job Title', type: 'text', object: 'contact' },
  
  // Company fields
  { id: 'company_name', name: 'Company Name', type: 'text', object: 'company' },
  { id: 'company_website', name: 'Website', type: 'url', object: 'company' },
  { id: 'company_industry', name: 'Industry', type: 'select', object: 'company' },
  { id: 'company_size', name: 'Company Size', type: 'select', object: 'company' },
  
  // Custom fields
  { id: 'custom_feedback', name: 'Feedback Category', type: 'select', object: 'custom' },
  { id: 'custom_priority', name: 'Priority Level', type: 'select', object: 'custom' },
  { id: 'custom_source', name: 'Source Channel', type: 'select', object: 'custom' },
];

// Mock data for available tables
const AVAILABLE_TABLES = [
  { id: 'contact', name: 'Contact' },
  { id: 'company', name: 'Company' },
  { id: 'custom', name: 'Custom Fields' },
];

export interface DataCollectionConfigProps {
  fields: DataCollectionField[];
  onFieldsChange: (fields: DataCollectionField[]) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export const DataCollectionConfig: React.FC<DataCollectionConfigProps> = ({
  fields,
  onFieldsChange,
  enabled,
  onEnabledChange,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-base">Data Collection</h3>
          <p className="text-sm text-gray-500">
            Collect visitor information before starting a chat
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          id="data-collection-toggle"
        />
      </div>
      
      {enabled ? (
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-base font-medium">Configure Data Collection Fields</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            {fields.length === 0 && (
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No fields are currently selected. Add at least one field to collect visitor information.
                </AlertDescription>
              </Alert>
            )}
            <FieldSelector
              fields={fields}
              tables={AVAILABLE_TABLES}
              availableFields={AVAILABLE_FIELDS}
              onFieldsChange={onFieldsChange}
              ensureEmailRequired={true}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="text-sm text-gray-500 italic">
          Enable data collection to configure which fields to collect from visitors.
        </div>
      )}
    </div>
  );
};
