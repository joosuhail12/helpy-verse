
import type { Chatbot } from '@/types/chatbot';

export const mockChatbots: Chatbot[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'A friendly chatbot for handling common customer support inquiries',
    status: 'active',
    createdAt: '2024-03-15T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    tone: 'friendly',
    customInstructions: '',
    welcomeMessage: 'Hi! How can I help you today?',
    humanHandoffMessage: "I'll connect you with a human agent who can better assist you with this.",
    behavior: {
      queryHandling: 'continuous',
      postAnswerAction: 'continue',
      inactivityTimeout: 300,
      inactivityAction: 'prompt',
      enableHumanHandoff: true,
    },
    dataCollection: {
      enabled: true,
      fields: [
        {
          id: '1',
          label: 'Name',
          type: 'text',
          required: true
        },
        {
          id: '2',
          label: 'Email',
          type: 'email',
          required: true
        },
        {
          id: '3',
          label: 'Issue Type',
          type: 'select',
          required: true,
          options: ['Technical Support', 'Billing', 'Sales', 'Other']
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'An AI assistant focused on product recommendations and sales',
    status: 'active',
    createdAt: '2024-03-14T15:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    tone: 'professional',
    customInstructions: 'Focus on understanding customer needs and suggesting relevant products',
    welcomeMessage: 'Welcome! I can help you find the perfect solution for your needs.',
    humanHandoffMessage: 'Let me connect you with one of our sales representatives for more detailed assistance.',
    behavior: {
      queryHandling: 'continuous',
      postAnswerAction: 'continue',
      inactivityTimeout: 600,
      inactivityAction: 'handoff',
      enableHumanHandoff: true,
    },
    dataCollection: {
      enabled: true,
      fields: [
        {
          id: '1',
          label: 'Company Name',
          type: 'text',
          required: true
        },
        {
          id: '2',
          label: 'Contact Email',
          type: 'email',
          required: true
        },
        {
          id: '3',
          label: 'Phone Number',
          type: 'phone',
          required: false
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Product Guide',
    description: 'Interactive product documentation and help assistant',
    status: 'active',
    createdAt: '2024-03-13T09:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
    tone: 'helpful',
    customInstructions: 'Provide clear, step-by-step guidance for product features',
    welcomeMessage: "Hello! I'm here to help you learn about our product features.",
    humanHandoffMessage: "I'll transfer you to our product specialist for more detailed guidance.",
    behavior: {
      queryHandling: 'continuous',
      postAnswerAction: 'continue',
      inactivityTimeout: 900,
      inactivityAction: 'close',
      enableHumanHandoff: true,
    },
    dataCollection: {
      enabled: false,
      fields: []
    }
  }
];

