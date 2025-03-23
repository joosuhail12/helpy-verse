
export interface EmailChannel {
  id: string;
  channelName: string;
  senderName: string;
  email: string;
  type: 'incoming' | 'outgoing' | 'both' | 'inbound' | 'outbound';
  createdAt: string;
  allowAgentConversations: boolean;
  useAgentNames: boolean;
  useOriginalSender: boolean;
  isActive: boolean;
  isVerified: boolean;
  name: string;
  // Add the previously missing properties
  autoBccEmail?: string;
  noReplyEmail?: string;
  icon?: string;
  isDefault?: boolean;
  updatedAt?: string;
  teamId?: string;
  domainStatus?: 'pending' | 'verified' | 'failed';
}
