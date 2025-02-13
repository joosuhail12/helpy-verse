
export type CustomFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select';

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  required: boolean;
  description: string;
  options?: string[]; // For select type fields
  createdAt: string;
  updatedAt: string;
}

export interface CustomFields {
  tickets: CustomField[];
  contacts: CustomField[];
  companies: CustomField[];
}
