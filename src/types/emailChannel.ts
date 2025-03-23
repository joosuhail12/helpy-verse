
export interface EmailChannel {
  id: string;
  channelName: string;
  senderName: string;
  email: string;
  type: 'incoming' | 'outgoing' | 'both';
  createdAt: string;
  allowAgentConversations: boolean;
  useAgentNames: boolean;
  useOriginalSender: boolean;
  isActive: boolean;
  isVerified: boolean;
  name: string;
}
