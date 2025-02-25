
import type { z } from 'zod';
import type { Chatbot } from '@/types/chatbot';
import { chatbotFormSchema } from '../schema/formSchema';

export type ChatbotFormData = z.infer<typeof chatbotFormSchema>;
export type ChatbotFormValues = Omit<Chatbot, 'id' | 'createdAt'>;

export interface Step {
  title: string;
  description: string;
  status: 'pending' | 'current' | 'complete';
}

export type WizardStep = Step & {
  title: string;
  description: string;
  status: 'pending' | 'current' | 'complete';
};

