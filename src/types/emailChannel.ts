
export interface EmailChannel {
  id: string;
  name: string;
  emoji: string;
  teamId: string;
  senderName: string;
  emailAddress: string;
  autoBccMail: string;
  noReplyMail: string;
  allowAgentOutbound: boolean;
  allowAgentName: boolean;
  orignalSenderAsRequester: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  isActive: boolean;
  isDefault: boolean;
  
  // Legacy properties for backward compatibility
  channelName?: string;
  email?: string;
  autoBccEmail?: string;
  noReplyEmail?: string;
  icon?: string;
  type?: 'sending' | 'receiving' | 'both';
  allowAgentConversations?: boolean;
  useAgentNames?: boolean;
  useOriginalSender?: boolean;
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
}
