
import type { QueryGroup } from './queryBuilder';

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  avatarUrl?: string;
  tone: string;
  customInstructions?: string;
  welcomeMessage: string;
  humanHandoffMessage: string;
  audienceRules: QueryGroup;
  dataCollection: {
    enabled: boolean;
    fields: DataCollectionField[];
  };
  behavior: {
    queryHandling: 'single' | 'continuous';
    postAnswerAction: 'continue' | 'close' | 'handoff';
    inactivityTimeout: number;
    inactivityAction: 'close' | 'handoff' | 'prompt';
    enableHumanHandoff: boolean;
  };
}

export type ChatbotTone = 'friendly' | 'professional' | 'casual' | 'formal' | 'helpful' | 'custom';

export interface DataCollectionField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select';
  required: boolean;
  options?: string[]; // For select type fields
}
