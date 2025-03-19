
export interface QueryRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: (QueryRule | QueryGroup)[];
}

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multi-select' | 'email' | 'phone';
export type ComparisonOperator = 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'exists' | 'notExists';
export type DataSource = 'contacts' | 'companies' | 'tickets' | 'custom_objects' | 'conversations';

export interface QueryField {
  id: string;
  label: string;
  type: FieldType;
  source: DataSource;
  customObject?: string;
  options?: string[];
}
