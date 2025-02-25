
import * as z from 'zod';

export const chatbotFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  avatarUrl: z.string().optional(),
  tone: z.enum(['friendly', 'professional', 'casual', 'formal', 'helpful', 'custom']),
  customInstructions: z.string().optional(),
  welcomeMessage: z.string().min(1, 'Welcome message is required'),
  humanHandoffMessage: z.string().min(1, 'Human handoff message is required'),
  status: z.literal('active'),
  dataCollection: z.object({
    enabled: z.boolean(),
    fields: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['text', 'email', 'phone', 'select']),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
    })),
  }),
  behavior: z.object({
    queryHandling: z.enum(['single', 'continuous']),
    postAnswerAction: z.enum(['continue', 'close', 'handoff']),
    inactivityTimeout: z.number(),
    inactivityAction: z.enum(['close', 'handoff', 'prompt']),
    enableHumanHandoff: z.boolean(),
  }),
});
