
export type ActionMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ParameterDependency {
  sourceParameterId: string;
  condition: 'equals' | 'notEquals' | 'contains' | 'exists';
  value: any;
}

export interface ActionParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: any;
  visible?: boolean;
  dependencies?: ParameterDependency[];
}

export interface CustomAction {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: ActionMethod;
  parameters: ActionParameter[];
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  
  // Additional properties used in components
  toolName?: string;
  headers?: Record<string, string>;
  connectedChatbots?: string[];
}
