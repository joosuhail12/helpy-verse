
// export interface EmailChannel {
//   id: string;
//   channelName: string;
//   senderName: string;
//   email: string;
//   autoBccEmail?: string;
//   noReplyEmail?: string;
//   icon?: string;
//   type: 'sending' | 'receiving' | 'both';
//   createdAt: string;
//   updatedAt?: string;
//   teamId?: string;
//   allowAgentConversations: boolean;
//   useAgentNames: boolean;
//   useOriginalSender: boolean;
//   isActive: boolean;
//   isDefault?: boolean;
// }

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
