
export type ActionMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ActionParameter = {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  defaultValue?: string;
};

export interface CustomAction {
  id: string;
  name: string;
  toolName: string;
  description: string;
  endpoint: string;
  method: ActionMethod;
  parameters: ActionParameter[];
  headers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  enabled: boolean;
}

