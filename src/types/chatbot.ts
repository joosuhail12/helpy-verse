
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
}

export type ChatbotTone = 'friendly' | 'professional' | 'casual' | 'formal' | 'helpful' | 'custom';

