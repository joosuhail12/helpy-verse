
export type ActionMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ParameterCondition {
  value: string | number | boolean;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
}

export interface ParameterDependency {
  paramId: string;
  condition: ParameterCondition;
}

export interface CustomAction {
  id: string;
  name: string;
  toolName: string;
  description: string;
  endpoint: string;
  method: ActionMethod;
  parameters: Array<{
    id: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
    required: boolean;
    defaultValue?: string;
    dependencies?: ParameterDependency[];
  }>;
  headers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  enabled: boolean;
  connectedChatbots?: Array<{
    id: string;
    name: string;
  }>;
}
