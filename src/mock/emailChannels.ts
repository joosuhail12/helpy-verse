
import { EmailChannel } from '@/types/emailChannel';

export const mockEmailChannels: EmailChannel[] = [
  {
    id: '1',
    name: 'Support Channel',
    channelName: 'Support Channel',
    senderName: 'Support Team',
    email: 'support@example.com',
    domain: 'example.com',
    noReplyEmail: 'noreply@example.com',
    icon: '💬',
    type: 'both',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    allowAgentConversations: true,
    useAgentNames: true,
    useOriginalSender: true,
    isActive: true,
    isDefault: true,
    domainStatus: 'verified'
  },
  {
    id: '2',
    name: 'Marketing Channel',
    channelName: 'Marketing Channel',
    senderName: 'Marketing Team',
    email: 'marketing@example.com',
    domain: 'example.com',
    autoBccEmail: 'marketing-archive@example.com',
    icon: '📢',
    type: 'sending',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
    allowAgentConversations: false,
    useAgentNames: false,
    useOriginalSender: false,
    isActive: true,
    isDefault: false,
    domainStatus: 'verified'
  }
];
