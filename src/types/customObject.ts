export interface CustomObject {
    id?: string;
    name: string;
    description: string;
    showInCustomerContext: boolean;
    showInCustomerDetail: boolean;
    showInCompanyDetail: boolean;
    connectiontype?: string;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
    customobjectfields?: CustomObjectField[];
}

export interface CustomObjectField {
    id: string,
    name: string,
    options: string[],
    fieldType: string,
    updatedAt: string,
    createdAt: string,
    isRequired: boolean,
    description: string,
    defaultValue: string,
    placeholder: string,
}

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
