
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
