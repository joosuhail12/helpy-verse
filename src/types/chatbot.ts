
export type ChatbotTone = 
  | 'professional' 
  | 'friendly' 
  | 'casual' 
  | 'formal'
  | 'technical'
  | 'empathetic'
  | 'helpful'
  | 'custom';

export interface DataCollectionField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select';
  required: boolean;
  options?: string[];
}

export interface Chatbot {
  id: string;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'inactive' | 'draft' | 'training';
  createdAt: string;
  updatedAt: string;
  knowledgeBase?: {
    id: string;
    name: string;
  };
  audience?: {
    rules: any;
  };
  settings?: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  
  // Additional properties
  avatarUrl?: string;
  tone?: ChatbotTone;
  welcomeMessage?: string;
  humanHandoffMessage?: string;
  customInstructions?: string;
  dataCollection?: {
    enabled: boolean;
    fields: DataCollectionField[];
  };
  behavior?: {
    queryHandling: 'single' | 'continuous';
    postAnswerAction: 'continue' | 'close' | 'handoff';
    inactivityTimeout: number;
    inactivityAction: 'close' | 'handoff' | 'prompt';
    enableHumanHandoff: boolean;
  };
  audienceRules?: {
    id: string;
    combinator: 'and' | 'or';
    rules: any[];
  };
}
