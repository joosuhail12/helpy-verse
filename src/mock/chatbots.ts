
import type { Chatbot } from '@/types/chatbot';

export const mockChatbots: Chatbot[] = [
  {
    id: '1',
    name: 'Support Assistant',
    description: 'General customer support chatbot',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    tone: 'friendly',
    welcomeMessage: 'Hi! How can I help you today?',
    humanHandoffMessage: "I'll connect you with a human agent who can better assist you.",
    audienceRules: {
      id: 'default',
      combinator: 'and',
      rules: []
    },
    dataCollection: {
      enabled: true,
      fields: [
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          required: true
        }
      ]
    },
    behavior: {
      queryHandling: 'continuous',
      postAnswerAction: 'continue',
      inactivityTimeout: 300,
      inactivityAction: 'prompt',
      enableHumanHandoff: true
    }
  }
];

