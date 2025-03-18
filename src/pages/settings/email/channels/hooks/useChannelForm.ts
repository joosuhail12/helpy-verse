
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { EmailChannel } from '@/types/emailChannel';

type EmailChannelFormData = Omit<EmailChannel, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'>

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
      name: '',
      emoji: '',
      teamId: '',
      senderName: '',
      emailAddress: '',
      autoBccMail: '',
      noReplyMail: '',
      allowAgentOutbound: false,
      allowAgentName: false,
      orignalSenderAsRequester: false,
      createdBy: '',
      deletedAt: '',
      isActive: false,
      isDefault: false,
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
        emoji: selectedEmoji || '',
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
    name: values.name,
    senderName: values.senderName,
    emailAddress: values.emailAddress,
    autoBccMail: values.autoBccMail,
    noReplyMail: values.noReplyMail,
    teamId: values.teamId,
    // Convenience setters
    setName: (value: string) => setFieldValue('name', value),
    setSenderName: (value: string) => setFieldValue('senderName', value),
    setEmailAddress: (value: string) => setFieldValue('emailAddress', value),
    setAutoBccMail: (value: string) => setFieldValue('autoBccMail', value),
    setNoReplyMail: (value: string) => setFieldValue('noReplyMail', value),
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
