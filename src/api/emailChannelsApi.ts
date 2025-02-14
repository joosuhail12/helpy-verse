
import { CreateEmailChannelDto, EmailChannel } from '@/types/emailChannel';

// In a real implementation, these would be actual API calls to your Node.js backend
export const emailChannelsApi = {
  getChannels: async (): Promise<EmailChannel[]> => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return [
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
  },

  createChannel: async (channel: CreateEmailChannelDto): Promise<EmailChannel> => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      ...channel,
      id: Math.random().toString(),
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
  },

  verifyChannel: async (id: string): Promise<void> => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  deleteChannel: async (id: string): Promise<void> => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  setDefaultChannel: async (id: string): Promise<void> => {
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
};
