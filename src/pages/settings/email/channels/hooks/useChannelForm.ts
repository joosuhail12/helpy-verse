import { useForm } from 'react-hook-form';
import type { EmailChannel } from '@/types/emailChannel';

interface EmailChannelFormData
  extends Omit<EmailChannel, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'> {}

export const useChannelForm = () => {
  const form = useForm<EmailChannelFormData>({
    defaultValues: {
      channelName: '',
      senderName: '',
      email: '',
      autoBccEmail: '',
      noReplyEmail: '',
      icon: '',
      type: 'both',
      isDefault: false,
      teamId: '',
      allowAgentConversations: false,
      useAgentNames: false,
      useOriginalSender: false,
    },
  });

  return form;
};
