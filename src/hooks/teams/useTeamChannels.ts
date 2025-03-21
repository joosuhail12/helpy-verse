
import { useState } from 'react';

export const useTeamChannels = (initialChatChannel?: string, initialEmailChannels: string[] = []) => {
  const [selectedChatChannel, setSelectedChatChannel] = useState<string | undefined>(initialChatChannel);
  const [selectedEmailChannels, setSelectedEmailChannels] = useState<string[]>(initialEmailChannels);

  const handleEmailChannelToggle = (channelId: string) => {
    setSelectedEmailChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  return {
    selectedChatChannel,
    setSelectedChatChannel,
    selectedEmailChannels,
    handleEmailChannelToggle,
  };
};
