
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { EmailChannel } from '@/types/emailChannel';

interface EmailChannelFormData
  extends Omit<EmailChannel, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'> {}

interface UseChannelFormProps {
  onAddChannel?: (data: EmailChannelFormData) => Promise<void>;
}

export const useChannelForm = (props?: UseChannelFormProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setValue,
    watch,
  } = useForm<EmailChannelFormData>({
    defaultValues: {
      channelName: '',
      name: '',
      senderName: '',
      email: '',
      autoBccEmail: '',
      noReplyEmail: '',
      icon: '',
      type: 'both',
      isDefault: false,
      teamId: '',
      domain: '',
      isActive: true,
      allowAgentConversations: false,
      useAgentNames: false,
      useOriginalSender: false,
    },
  });

  const values = watch();

  const setFieldValue = (field: keyof EmailChannelFormData, value: any) => {
    setValue(field, value);
  };

  const onSubmit = async (data: EmailChannelFormData) => {
    if (props?.onAddChannel) {
      await props.onAddChannel({
        ...data,
        icon: selectedEmoji || '',
      });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    formState: { errors, isSubmitting, touchedFields },
    values,
    setFieldValue,
    selectedEmoji,
    setSelectedEmoji,
    // Convenience getters for form values
    channelName: values.channelName,
    senderName: values.senderName,
    email: values.email,
    autoBccEmail: values.autoBccEmail,
    noReplyEmail: values.noReplyEmail,
    selectedTeamId: values.teamId,
    // Convenience setters
    setChannelName: (value: string) => setFieldValue('channelName', value),
    setSenderName: (value: string) => setFieldValue('senderName', value),
    setEmail: (value: string) => setFieldValue('email', value),
    setAutoBccEmail: (value: string) => setFieldValue('autoBccEmail', value),
    setNoReplyEmail: (value: string) => setFieldValue('noReplyEmail', value),
    setSelectedTeamId: (value?: string) => setFieldValue('teamId', value || ''),
    // Form state helpers
    errors,
    touched: touchedFields,
    setFieldTouched: (field: keyof EmailChannelFormData) => {
      setValue(field, values[field], { shouldTouch: true });
    },
    isSubmitting,
  };
};
