
import type { EmailChannel } from '@/types/emailChannel';

export const mockEmailChannels: EmailChannel[] = [
  {
    id: 'channel-1',
    name: 'Main Support',
    channelName: 'Main Support',
    senderName: 'Support Team',
    email: 'support@example.com',
    type: 'both',
    createdAt: '2024-03-01T10:00:00Z',
    isActive: true,
    isVerified: true,
    allowAgentConversations: true,
    useAgentNames: true,
    useOriginalSender: false,
    autoBccEmail: 'archive@example.com',
    noReplyEmail: 'no-reply@example.com',
    icon: '📧',
    isDefault: true,
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: 'channel-2',
    name: 'Sales Inquiries',
    channelName: 'Sales Inquiries',
    senderName: 'Sales Team',
    email: 'sales@example.com',
    type: 'outbound',
    createdAt: '2024-03-05T09:15:00Z',
    isActive: true,
    isVerified: true,
    allowAgentConversations: true,
    useAgentNames: false,
    useOriginalSender: true
  },
  {
    id: 'channel-3',
    name: 'Technical Support',
    channelName: 'Technical Support',
    senderName: 'Tech Support',
    email: 'tech@example.com',
    type: 'inbound',
    createdAt: '2024-03-10T14:20:00Z',
    isActive: true,
    isVerified: true,
    allowAgentConversations: true,
    useAgentNames: true,
    useOriginalSender: false
  }
];
