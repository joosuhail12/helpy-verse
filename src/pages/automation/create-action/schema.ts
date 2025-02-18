
import { z } from 'zod';

export const createActionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  endpoint: z.string().min(1, 'API Endpoint is required'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const),
  description: z.string().min(1, 'Description is required'),
  headers: z.string(),
  parameters: z.string(),
  parameterDescriptions: z.string(),
  connectedChatbots: z.array(z.string()),
});

export type FormValues = z.infer<typeof createActionSchema>;
