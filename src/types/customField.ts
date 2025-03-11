
// export type CustomFieldType = 
//   | 'text' 
//   | 'number' 
//   | 'date' 
//   | 'boolean' 
//   | 'select'
//   | 'multi-select'
//   | 'rich-text'
//   | 'file'
//   | 'currency'
//   | 'url'
//   | 'email'
//   | 'tel'
//   | 'phone';

// export interface ValidationRule {
//   type: 'required' | 'minLength' | 'maxLength' | 'regex' | 'min' | 'max';
//   value: string | number;
//   message: string;
// }

// export interface FieldDependency {
//   fieldId: string;
//   operator: 'equals' | 'notEquals' | 'contains' | 'notContains';
//   value: string | number | boolean;
// }

// export interface FieldHistoryEntry {
//   id: string;
//   timestamp: string;
//   userId: string;
//   userName: string;
//   action: 'created' | 'updated' | 'deleted';
//   changes?: {
//     field: string;
//     oldValue: any;
//     newValue: any;
//   }[];
// }

// export interface CustomField {
//   id: string;
//   name: string;
//   type: CustomFieldType;
//   required: boolean;
//   description: string;
//   options?: string[]; // For select and multi-select type fields
//   validationRules?: ValidationRule[];
//   dependencies?: FieldDependency[];
//   visible?: boolean;
//   createdAt: string;
//   updatedAt: string;
//   history: FieldHistoryEntry[];
// }

// export interface CustomFields {
//   tickets: CustomField[];
//   contacts: CustomField[];
//   companies: CustomField[];
// }

