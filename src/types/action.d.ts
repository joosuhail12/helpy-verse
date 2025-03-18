
export type ActionMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ActionParameter {
  id: string;
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  default?: any;
  options?: string[];
  isSecret?: boolean;
}

export interface CustomAction {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  toolName: string;
  endpoint: string;
  method: ActionMethod;
  parameters: ActionParameter[];
  headers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  connectedChatbots?: Array<{ id: string; name: string }>;
  createdBy?: {
    id: string;
    name: string;
    avatar: string;
  };
  enabled: boolean;
}

export type Action = CustomAction;
