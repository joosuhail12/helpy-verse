
import { useState } from 'react';
import type { CreateEmailChannelDto } from '@/types/emailChannel';

interface UseChannelFormProps {
  onAddChannel: (channel: CreateEmailChannelDto) => void;
}

export function useChannelForm({ onAddChannel }: UseChannelFormProps) {
  const [channelName, setChannelName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [autoBccEmail, setAutoBccEmail] = useState('');
  const [noReplyEmail, setNoReplyEmail] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!channelName.trim()) {
      errors.channelName = 'Channel name is required';
    } else if (channelName.length > 50) {
      errors.channelName = 'Channel name must be less than 50 characters';
    }

    if (!senderName.trim()) {
      errors.senderName = 'Sender name is required';
    } else if (senderName.length > 50) {
      errors.senderName = 'Sender name must be less than 50 characters';
    }

    if (!email) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid email address';
    }

    if (autoBccEmail && !validateEmail(autoBccEmail)) {
      errors.autoBccEmail = 'Invalid email address';
    }

    if (noReplyEmail && !validateEmail(noReplyEmail)) {
      errors.noReplyEmail = 'Invalid email address';
    }

    return errors;
  };

  const errors = validate();

  const setFieldTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allFields = ['channelName', 'senderName', 'email', 'autoBccEmail', 'noReplyEmail'];
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(newTouched);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      onAddChannel({
        channelName,
        senderName,
        email,
        autoBccEmail: autoBccEmail || undefined,
        noReplyEmail: noReplyEmail || undefined,
        icon: selectedEmoji || undefined,
        type: 'both',
        isDefault: false,
      });
    }
  };

  return {
    channelName,
    setChannelName,
    senderName,
    setSenderName,
    email,
    setEmail,
    autoBccEmail,
    setAutoBccEmail,
    noReplyEmail,
    setNoReplyEmail,
    selectedEmoji,
    setSelectedEmoji,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  };
}
