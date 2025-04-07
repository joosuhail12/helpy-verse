
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import type { DataCollectionField } from '@/types/chatbot';
import { FieldSelector } from '@/components/settings/chat/FieldSelector';

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Data Collection</h3>
          <p className="text-sm text-gray-500">
            Collect information from users before starting a chat
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          id="data-collection-toggle"
        />
      </div>
      
      {enabled && (
        <Card>
          <CardContent className="pt-4">
            <FieldSelector
              fields={fields}
              tables={AVAILABLE_TABLES}
              availableFields={AVAILABLE_FIELDS}
              onFieldsChange={onFieldsChange}
              ensureEmailRequired={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
