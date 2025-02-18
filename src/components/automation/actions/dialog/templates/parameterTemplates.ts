
import { ActionParameter } from '@/types/action';
import { v4 as uuidv4 } from 'uuid';

export const parameterTemplates = {
  authentication: [
    {
      id: uuidv4(),
      name: 'authType',
      type: 'string' as const,
      description: 'Authentication type (apiKey or bearerToken)',
      required: true,
      defaultValue: 'apiKey',
    },
    {
      id: uuidv4(),
      name: 'apiKey',
      type: 'string' as const,
      description: 'API Key for authentication',
      required: true,
      dependencies: [{
        paramId: '', // This will be set when the template is used
        condition: {
          value: 'apiKey',
          operator: 'equals',
        },
      }],
    },
    {
      id: uuidv4(),
      name: 'bearerToken',
      type: 'string' as const,
      description: 'Bearer token for authentication',
      required: true,
      dependencies: [{
        paramId: '', // This will be set when the template is used
        condition: {
          value: 'bearerToken',
          operator: 'equals',
        },
      }],
    }
  ],
  pagination: [
    {
      id: uuidv4(),
      name: 'page',
      type: 'number' as const,
      description: 'Page number for pagination',
      required: true,
    },
    {
      id: uuidv4(),
      name: 'limit',
      type: 'number' as const,
      description: 'Number of items per page',
      required: true,
    }
  ],
  filtering: [
    {
      id: uuidv4(),
      name: 'filter',
      type: 'string' as const,
      description: 'Filter criteria',
      required: false,
    },
    {
      id: uuidv4(),
      name: 'sort',
      type: 'string' as const,
      description: 'Sort direction (asc/desc)',
      required: false,
    }
  ]
} as const;

