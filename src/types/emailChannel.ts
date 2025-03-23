
export interface EmailChannel {
  id: string;
  channelName: string;
  senderName: string;
  email: string;
  type: 'inbound' | 'outbound' | 'both';
  createdAt: string;
  allowAgentConversations: boolean;
  useAgentNames: boolean;
  useOriginalSender: boolean;
  isActive: boolean;
  isVerified: boolean;
  name: string;
  // Additional properties used in components
  autoBccEmail?: string;
  noReplyEmail?: string;
  icon?: string;
  isDefault?: boolean;
  updatedAt?: string;
  teamId?: string;
  domainStatus?: 'pending' | 'verified' | 'failed';
}
