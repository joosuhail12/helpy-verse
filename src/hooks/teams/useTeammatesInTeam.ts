
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchTeammates } from '@/store/slices/teammates/actions';
import { selectAllTeammates, selectTeammatesLoading } from '@/store/slices/teammates/selectors';
import { useTeamMembers } from './useTeamMembers';

export const useTeammatesInTeam = (teamId?: string) => {
  const dispatch = useAppDispatch();
  const allTeammates = useAppSelector(selectAllTeammates);
  const isLoading = useAppSelector(selectTeammatesLoading);
  const [initialMemberIds, setInitialMemberIds] = useState<string[]>([]);
  const { selectedTeammates, setSelectedTeammates, toggleTeammate } = useTeamMembers(initialMemberIds);

  useEffect(() => {
    // Load teammates if not already loaded
    if (allTeammates.length === 0 && !isLoading) {
      dispatch(fetchTeammates());
    }
  }, [dispatch, allTeammates.length, isLoading]);

  useEffect(() => {
    // If we have a team ID, filter teammates by that team
    if (teamId) {
      const teammatesInTeam = allTeammates.filter(teammate => teammate.team === teamId || teammate.teamId === teamId);
      setInitialMemberIds(teammatesInTeam.map(teammate => teammate.id));
    }
  }, [teamId, allTeammates]);

  return {
    allTeammates,
    isLoading,
    selectedTeammates,
    setSelectedTeammates,
    toggleTeammate
  };
};
