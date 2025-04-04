
import { ChatMessage } from '@/types/conversation';
import { v4 as uuidv4 } from 'uuid';

export const MOCK_CONVERSATIONS = {
  'customer-service': (conversationId: string): ChatMessage[] => [
    {
      id: uuidv4(),
      sender: 'user',
      content: 'Hello, I have a problem with my recent order #12345.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      conversationId
    },
    {
      id: uuidv4(),
      sender: 'agent',
      content: 'I understand you\'re having an issue with your order. Could you please provide more details about the problem?',
      timestamp: new Date(Date.now() - 3540000), // 59 minutes ago
      conversationId,
      readBy: ['user']
    },
    {
      id: uuidv4(),
      sender: 'user',
      content: 'I ordered a blue shirt, but received a red one instead.',
      timestamp: new Date(Date.now() - 3480000), // 58 minutes ago
      conversationId
    },
    {
      id: uuidv4(),
      sender: 'agent',
      content: 'I apologize for the mistake. I\'ll arrange for a return and shipment of the correct item right away.',
      timestamp: new Date(Date.now() - 3420000), // 57 minutes ago
      conversationId,
      readBy: ['user']
    },
    {
      id: uuidv4(),
      sender: 'user',
      content: 'Thank you! How long will it take?',
      timestamp: new Date(Date.now() - 3360000), // 56 minutes ago
      conversationId
    },
    {
      id: uuidv4(),
      sender: 'agent',
      content: 'We\'ll ship the correct item within 24 hours, and it should arrive in 2-3 business days. We\'ll also send a return label for the incorrect item.',
      timestamp: new Date(Date.now() - 3300000), // 55 minutes ago
      conversationId,
      readBy: ['user']
    },
    {
      id: uuidv4(),
      sender: 'user',
      content: 'Perfect, thank you for your help!',
      timestamp: new Date(Date.now() - 3240000), // 54 minutes ago
      conversationId
    },
    {
      id: uuidv4(),
      sender: 'agent',
      content: 'Great! Have a wonderful day, and don\'t hesitate to reach out if you need any further assistance.',
      timestamp: new Date(Date.now() - 3180000), // 53 minutes ago
      conversationId,
      readBy: ['user']
    }
  ],
  'technical-support': (conversationId: string): ChatMessage[] => [
    {
      id: uuidv4(),
      sender: 'user',
      content: 'I can\'t log into my account. It keeps saying "invalid credentials".',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      conversationId
    },
    {
      id: uuidv4(),
      sender: 'agent',
      content: 'I\'m sorry to hear you\'re having trouble logging in. Let me help you troubleshoot this issue. Have you tried resetting your password?',
      timestamp: new Date(Date.now() - 7140000), // 119 minutes ago
      conversationId,
      readBy: ['user']
    }
  ],
  'billing-inquiry': (conversationId: string): ChatMessage[] => [
    {
      id: uuidv4(),
      sender: 'user',
      content: 'I think I was charged twice for my subscription this month.',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      conversationId
    },
    {
      id: uuidv4(),
      sender: 'agent',
      content: 'I apologize for the confusion with your billing. Let me check your account details and verify the charges.',
      timestamp: new Date(Date.now() - 14340000), // 239 minutes ago
      conversationId,
      readBy: ['user']
    }
  ]
};
