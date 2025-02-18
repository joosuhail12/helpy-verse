
import { ActionParameter } from '@/types/action';
import { v4 as uuidv4 } from 'uuid';

export const parameterTemplates = {
  authentication: [
    {
      id: uuidv4(),
      name: 'apiKey',
      type: 'string',
      description: 'API Key for authentication',
      required: true,
    },
    {
      id: uuidv4(),
      name: 'bearerToken',
      type: 'string',
      description: 'Bearer token for authentication',
      required: true,
    }
  ],
  pagination: [
    {
      id: uuidv4(),
      name: 'page',
      type: 'number',
      description: 'Page number for pagination',
      required: true,
    },
    {
      id: uuidv4(),
      name: 'limit',
      type: 'number',
      description: 'Number of items per page',
      required: true,
    }
  ],
  filtering: [
    {
      id: uuidv4(),
      name: 'filter',
      type: 'string',
      description: 'Filter criteria',
      required: false,
    },
    {
      id: uuidv4(),
      name: 'sort',
      type: 'string',
      description: 'Sort direction (asc/desc)',
      required: false,
    }
  ]
} as const;

