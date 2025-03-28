
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    status: 'delivered',
  },
  {
    id: '2',
    content: 'I have a question about my subscription',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'delivered',
  },
  {
    id: '3',
    content: 'Sure, I\'d be happy to help with your subscription. What specifically would you like to know?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    status: 'delivered',
  },
  {
    id: '4',
    content: 'I want to upgrade my plan',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    status: 'delivered',
  },
  {
    id: '5',
    content: 'That\'s great! I can definitely help you upgrade your plan. Which plan were you interested in upgrading to?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: 'delivered',
  }
];
