
export interface QueryField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select';
  source?: string;
  source_type?: string;
  options?: string[];
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  default?: any;
}

export type DataSource = 'contacts' | 'companies' | 'deals' | 'tickets' | 'emails' | '';

export type Combinator = 'and' | 'or';

export interface QueryRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: Combinator;
  rules: (QueryRule | QueryGroup)[];
}

export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
  path?: string;
}
