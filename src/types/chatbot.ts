
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
  dataCollection: {
    enabled: boolean;
    fields: DataCollectionField[];
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

