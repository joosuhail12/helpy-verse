
import { useState } from 'react';
import type { icons } from '../components/IconSelection';

interface UseChannelFormProps {
  onAddChannel: (channel: {
    channelName: string;
    senderName: string;
    email: string;
    autoBccEmail?: string;
    noReplyEmail?: string;
    icon?: string;
    type: 'sending' | 'receiving' | 'both';
    isDefault: boolean;
  }) => void;
}

export function useChannelForm({ onAddChannel }: UseChannelFormProps) {
  const [channelName, setChannelName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [autoBccEmail, setAutoBccEmail] = useState('');
  const [noReplyEmail, setNoReplyEmail] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<typeof icons[0] | null>(null);
  const [type] = useState<'sending' | 'receiving' | 'both'>('both');

  const resetForm = () => {
    setChannelName('');
    setSenderName('');
    setEmail('');
    setAutoBccEmail('');
    setNoReplyEmail('');
    setSelectedIcon(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChannel({
      channelName,
      senderName,
      email,
      autoBccEmail,
      noReplyEmail,
      icon: selectedIcon ? selectedIcon.label : undefined,
      type,
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
    handleSubmit,
    resetForm,
  };
}
