
export type CustomFieldType =
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'select'
    | 'multi-select'
    | 'rich-text'
    | 'file'
    | 'currency'
    | 'url'
    | 'email'
    | 'tel'
    | 'phone';

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

export interface FieldHistoryEntry {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: 'created' | 'updated' | 'deleted';
    changes?: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
}

export interface CustomField {
    id: string;
    name: string;
    fieldType: CustomFieldType;
    isRequired: boolean;
    placeholder: string;
    options: string[] | null;
    entityType: "ticket" | "customer" | "company";
    defaultValue: string | null;
    description: string | null;
    validationRules?: ValidationRule[];
    history?: FieldHistoryEntry[];
}
