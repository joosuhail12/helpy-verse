
import { useState, useEffect } from 'react';
import type { Team } from '@/types/team';

export const useTeamFormData = (team: Team) => {
  const [teamName, setTeamName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');

  useEffect(() => {
    if (team) {
      console.log('Team data loaded for editing:', team);
      setTeamName(team.name || '');
      setSelectedIcon(team.icon || '');
    }
  }, [team]);

  return {
    teamName,
    setTeamName,
    selectedIcon,
    setSelectedIcon,
    isSubmitDisabled: !teamName.trim()
  };
};
