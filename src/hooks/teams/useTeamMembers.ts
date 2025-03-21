
import { useState } from 'react';

export const useTeamMembers = (initialMembers: string[] = []) => {
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>(initialMembers);

  const toggleTeammate = (teammateId: string) => {
    setSelectedTeammates(prev =>
      prev.includes(teammateId)
        ? prev.filter(id => id !== teammateId)
        : [...prev, teammateId]
    );
  };

  return {
    selectedTeammates,
    setSelectedTeammates,
    toggleTeammate
  };
};
