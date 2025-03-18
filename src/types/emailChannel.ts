
export interface EmailChannel {
  id: string;
  name?: string;
  channelName: string;
  senderName: string;
  email: string;
  autoBccEmail?: string;
  noReplyEmail?: string;
  icon?: string;
  type: 'sending' | 'receiving' | 'both';
  createdAt: string;
  updatedAt?: string;
  teamId?: string;
  domainStatus?: string;
  allowAgentConversations: boolean;
  useAgentNames: boolean;
  useOriginalSender: boolean;
  isActive: boolean;
  isDefault?: boolean;
  isVerified?: boolean;
}

export interface CreateEmailChannelDto {
  channelName: string;
  senderName: string;
  email: string;
  autoBccEmail?: string;
  noReplyEmail?: string;
  icon?: string;
  type: 'sending' | 'receiving' | 'both';
  teamId?: string;
  allowAgentConversations: boolean;
  useAgentNames: boolean;
  useOriginalSender: boolean;
  isActive: boolean;
  name?: string;
  domainStatus?: string;
}
