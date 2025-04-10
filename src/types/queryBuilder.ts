
import { ReactNode } from 'react';

export interface QueryRuleOption {
  label: string;
  value: string | number | boolean;
}

export interface QueryField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multi-select';
  defaultOperator?: string;
  options?: QueryRuleOption[];
  operators?: string[];
  placeholder?: string;
  validate?: (value: any) => boolean | string;
}

export type QueryOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equals'
  | 'less_than_or_equals'
  | 'is_empty'
  | 'is_not_empty'
  | 'in'
  | 'not_in'
  | 'between'
  | 'not_between';

export interface QueryRule {
  id: string;
  field: string;
  operator: QueryOperator;
  value: string | number | boolean | Array<string | number | boolean> | null;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<QueryRule | QueryGroup>;
}

export type DataSource = 
  | 'contacts'
  | 'companies'
  | 'tickets'
  | 'custom_objects';
