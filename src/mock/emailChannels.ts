
import type { EmailChannel } from '@/types/emailChannel';

export const mockEmailChannels: EmailChannel[] = [
  {
    id: '1',
    name: 'Primary Support',
    senderName: 'Support Team',
    emailAddress: 'support@company.com',
    noReplyMail: 'no-reply@company.com',
    emoji: '📧',
    teamId: '1',
    autoBccMail: '',
    allowAgentOutbound: true,
    allowAgentName: true,
    orignalSenderAsRequester: true,
    createdBy: 'system',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    deletedAt: '',
    isActive: true,
    isDefault: true,
    
    // Legacy properties
    channelName: 'Primary Support',
    email: 'support@company.com',
    type: 'both',
    allowAgentConversations: true,
    useAgentNames: true,
    useOriginalSender: true
  },
  {
    id: '2',
    name: 'Marketing Updates',
    senderName: 'Marketing',
    emailAddress: 'marketing@company.com',
    autoBccMail: 'archive@company.com',
    noReplyMail: '',
    emoji: '📢',
    teamId: '2',
    allowAgentOutbound: false,
    allowAgentName: false,
    orignalSenderAsRequester: false,
    createdBy: 'system',
    createdAt: '2024-03-09T15:30:00Z',
    updatedAt: '2024-03-09T15:30:00Z',
    deletedAt: '',
    isActive: true,
    isDefault: false,
    
    // Legacy properties
    channelName: 'Marketing Updates',
    email: 'marketing@company.com',
    autoBccEmail: 'archive@company.com',
    icon: 'MessageCircle',
    type: 'sending',
    allowAgentConversations: false,
    useAgentNames: false,
    useOriginalSender: false
  }
];

export const mockWorkspace = {
  name: 'acme',
  defaultEmail: 'acme@mail.pullse.ai',
  hasDomainVerified: false,
};
