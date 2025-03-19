
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
