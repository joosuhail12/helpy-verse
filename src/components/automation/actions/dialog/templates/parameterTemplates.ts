
import type { ActionParameter } from '@/types/action';

export const parameterTemplates: Record<string, ActionParameter[]> = {
  authentication: [
    {
      id: 'api-key',
      name: 'apiKey',
      type: 'string',
      description: 'API Key for authentication',
      required: true,
    }
  ],
  pagination: [
    {
      id: 'page',
      name: 'page',
      type: 'number',
      description: 'Page number',
      required: true,
      defaultValue: '1'
    },
    {
      id: 'limit',
      name: 'limit',
      type: 'number',
      description: 'Number of items per page',
      required: true,
      defaultValue: '10'
    }
  ]
};
