
export type ActionMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ParameterDependency {
  sourceParameterId: string;
  condition: {
    operator: 'equals' | 'notEquals' | 'contains' | 'exists' | 'greaterThan' | 'lessThan';
    value: any;
  };
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
  
  // Additional properties used in the application
  toolName?: string;
  headers?: Record<string, string>;
  connectedChatbots?: Array<{id: string, name: string}>;
  category?: string;
  isActive?: boolean;
  createdBy?: {
    id: string;
    name: string;
    avatar: string;
  };
}
