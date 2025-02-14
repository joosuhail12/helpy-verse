
export interface EmailChannel {
  id: string;
  channelName: string;
  senderName: string;
  email: string;
  autoBccEmail?: string;
  noReplyEmail?: string;
  icon?: string;
  type: 'sending' | 'receiving' | 'both';
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  teamId?: string; // Add teamId as optional
}

export interface CreateEmailChannelDto {
  channelName: string;
  senderName: string;
  email: string;
  autoBccEmail?: string;
  noReplyEmail?: string;
  icon?: string;
  type: 'sending' | 'receiving' | 'both';
  isDefault: boolean;
  teamId?: string; // Add teamId as optional
}

