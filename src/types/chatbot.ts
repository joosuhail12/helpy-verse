
/**
 * Available tones for chatbot personality
 */
export type ChatbotTone = 'friendly' | 'professional' | 'casual' | 'formal' | 'helpful' | 'custom';

/**
 * Data collection field configuration
 */
export interface DataCollectionField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select';
  required: boolean;
  options?: string[]; // For select type fields
}

/**
 * Query handling configuration
 */
export interface ChatbotBehavior {
  queryHandling: 'single' | 'continuous';
  postAnswerAction: 'continue' | 'close' | 'handoff';
  inactivityTimeout: number; // in seconds
  inactivityAction: 'close' | 'handoff' | 'prompt';
  enableHumanHandoff: boolean;
}

/**
 * Data collection configuration
 */
export interface DataCollection {
  enabled: boolean;
  fields: DataCollectionField[];
}

/**
 * Main chatbot configuration type
 */
export interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  avatarUrl?: string;
  tone: ChatbotTone;
  customInstructions?: string;
  welcomeMessage: string;
  humanHandoffMessage: string;
  dataCollection: DataCollection;
  behavior: ChatbotBehavior;
}

