
export type CustomFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'regex' | 'min' | 'max';
  value: string | number;
  message: string;
}

export interface FieldDependency {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
  value: string | number | boolean;
}

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  required: boolean;
  description: string;
  options?: string[]; // For select type fields
  validationRules?: ValidationRule[];
  dependencies?: FieldDependency[];
  visible?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomFields {
  tickets: CustomField[];
  contacts: CustomField[];
  companies: CustomField[];
}
