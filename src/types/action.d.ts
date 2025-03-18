
import { Action } from '@/store/slices/actions/actionsSlice';

export type ActionMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ActionParameterType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'datetime'
  | 'date'
  | 'json'
  | 'file';

export interface ParameterOption {
  label: string;
  value: string;
}

export interface ParameterDependency {
  paramId: string;
  condition: {
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number | boolean;
  };
}

export interface ActionParameter {
  id: string;
  name: string;
  type: ActionParameterType;
  description: string;
  required: boolean;
  defaultValue?: string;
  options?: ParameterOption[];
  dependencies?: ParameterDependency[];
  format?: string;
  visible?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface CustomAction {
  id: string;
  name: string;
  toolName: string;
  description: string;
  endpoint: string;
  method: ActionMethod;
  headers: Record<string, string>;
  parameters: ActionParameter[];
  enabled?: boolean;
  createdAt: string;
  updatedAt: string;
  connectedChatbots?: Array<{ id: string; name: string }>;
}
