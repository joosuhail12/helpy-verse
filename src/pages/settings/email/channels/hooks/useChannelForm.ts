
import { useState } from 'react';
import type { icons } from '../components/IconSelection';
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
  const [selectedIcon, setSelectedIcon] = useState<typeof icons[0] | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const resetForm = () => {
    setChannelName('');
    setSenderName('');
    setEmail('');
    setAutoBccEmail('');
    setNoReplyEmail('');
    setSelectedIcon(null);
    setSelectedEmoji(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChannel({
      channelName,
      senderName,
      email,
      autoBccEmail: autoBccEmail || undefined,
      noReplyEmail: noReplyEmail || undefined,
      icon: selectedIcon ? selectedIcon.label : selectedEmoji || undefined,
      type: 'both',
      isDefault: false,
    });
    resetForm();
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
    selectedIcon,
    setSelectedIcon,
    selectedEmoji,
    setSelectedEmoji,
    handleSubmit,
    resetForm,
  };
}
