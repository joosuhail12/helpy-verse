
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
    isDefault: true,
    isVerified: true,
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: '2',
    channelName: 'Marketing Updates',
    senderName: 'Marketing',
    email: 'marketing@company.com',
    autoBccEmail: 'archive@company.com',
    icon: 'MessageCircle',
    type: 'sending',
    isDefault: false,
    isVerified: true,
    createdAt: '2024-03-09T15:30:00Z',
  }
];

