
import type { EmailChannel } from '@/types/emailChannel';

export const mockEmailChannels: EmailChannel[] = [
  {
    id: '1',
    channelName: 'Primary Support',
    senderName: 'Support Team',
    email: 'support@company.com',
    noReplyEmail: 'no-reply@company.com',
    icon: 'Mail',
    type: 'both',
    createdAt: '2024-03-10T10:00:00Z',
    allowAgentConversations: true,
    useAgentNames: true,
    useOriginalSender: true,
    isActive: true,
  },
  {
    id: '2',
    channelName: 'Marketing Updates',
    senderName: 'Marketing',
    email: 'marketing@company.com',
    autoBccEmail: 'archive@company.com',
    icon: 'MessageCircle',
    type: 'sending',
    createdAt: '2024-03-09T15:30:00Z',
    allowAgentConversations: false,
    useAgentNames: false,
    useOriginalSender: false,
    isActive: true,
  }
];

export const mockWorkspace = {
  name: 'acme',
  defaultEmail: 'acme@mail.pullse.ai',
  hasDomainVerified: false,
};
