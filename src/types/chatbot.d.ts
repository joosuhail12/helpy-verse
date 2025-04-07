
export interface Chatbot {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt?: string;
  welcomeMessage?: string;
  tone?: ChatbotTone;
  dataCollection?: {
    enabled: boolean;
    fields: DataCollectionField[];
  };
  behavior?: {
    showTicketStatusBar: boolean;
    allowEndChat: boolean;
    enableMessageReactions: boolean;
    enableDeliveryReceipts: boolean;
    showAgentPresence: boolean;
    enableConversationRating: boolean;
  };
  appearance?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    userMessageBackground: string;
    agentMessageBackground: string;
    logo?: string;
    headerLogo?: string;
    launcherIcon?: string;
    position: 'left' | 'right';
    offsetX: number;
    offsetY: number;
    compactMode: boolean;
  };
  textLabels?: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    askQuestionButton: string;
  };
  deployment?: {
    type: 'widget' | 'api' | 'embed';
    domains?: string[];
    apiKey?: string;
  };
}

export type ChatbotTone = 
  | 'professional' 
  | 'friendly' 
  | 'casual' 
  | 'formal' 
  | 'technical' 
  | 'helpful' 
  | 'empathetic';

export interface DataCollectionField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'checkbox';
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
}

export interface DataCollectionConfigProps {
  fields: DataCollectionField[];
  enabled: boolean;
  onFieldsChange: (fields: DataCollectionField[]) => void;
  onEnabledChange: (enabled: boolean) => void;
}
