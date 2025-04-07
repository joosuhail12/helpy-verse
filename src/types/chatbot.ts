
// Common types used for chatbot and automation features

export interface DataCollectionField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'multi-select' | 'date' | 'number' | 'checkbox';
  required: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  description?: string;
}

export type ChatbotStatus = 'active' | 'inactive' | 'draft' | 'archived';
export type ChatbotTone = 'friendly' | 'professional' | 'casual' | 'formal' | 'helpful' | 'custom';

export interface ChatbotConfig {
  name: string;
  description?: string;
  welcomeMessage: string;
  primaryColor: string;
  logoUrl?: string;
  collectData: boolean;
  dataCollectionFields: DataCollectionField[];
  showTicketStatusBar: boolean;
  allowEndChat: boolean;
  enableReceipts: boolean;
  enableMessageReactions: boolean;
  showAgentPresence: boolean;
  enableConversationRating: boolean;
  status: ChatbotStatus;
}

export interface ChatbotPreset {
  id: string;
  name: string;
  description: string;
  config: Partial<ChatbotConfig>;
  createdAt: string;
  updatedAt: string;
}

export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  status: ChatbotStatus;
  createdAt: string;
  tone?: ChatbotTone;
  avatarUrl?: string;
  customInstructions?: string;
  welcomeMessage: string;
  humanHandoffMessage?: string;
  audienceRules: {
    id: string;
    combinator: 'and' | 'or';
    rules: any[];
  };
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
  messageCount?: number;
  category?: string;
}
