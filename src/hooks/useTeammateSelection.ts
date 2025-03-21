
import { useState } from 'react';
import type { Teammate } from '@/types/teammate';

/**
 * Hook for managing teammate selection
 */
export const useTeammateSelection = (paginatedTeammates: Teammate[]) => {
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTeammates(paginatedTeammates.map(t => t.id));
    } else {
      setSelectedTeammates([]);
    }
  };

  const handleSelectTeammate = (teammateId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeammates(prev => [...prev, teammateId]);
    } else {
      setSelectedTeammates(prev => prev.filter(id => id !== teammateId));
    }
  };

  return {
    selectedTeammates,
    setSelectedTeammates,
    handleSelectAll,
    handleSelectTeammate
  };
};
