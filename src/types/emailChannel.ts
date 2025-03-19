
export interface EmailChannel {
  id: string;
  name: string;
  email: string;
  domain: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties used in the application
  channelName: string;
  senderName: string;
  icon?: string;
  type: 'both' | 'sending' | 'receiving';
  noReplyEmail?: string;
  autoBccEmail?: string;
  allowAgentConversations: boolean;
  useAgentNames: boolean;
  useOriginalSender: boolean;
  domainStatus?: string;
}
