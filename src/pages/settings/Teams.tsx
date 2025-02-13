
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import TeamsEmptyState from '@/components/teams/TeamsEmptyState';
import TeamsList from '@/components/teams/TeamsList';
import CreateTeamDialog from '@/components/teams/CreateTeamDialog';
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { setLoading, setError, setTeams } from '@/store/slices/teams/teamsSlice';
import { mockTeams } from '@/store/slices/teams/mockData';

const Teams = () => {
  const dispatch = useAppDispatch();
  const { teams, loading, error } = useAppSelector((state) => state.teams);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        dispatch(setLoading(true));
        // Try to fetch from API first
        const response = await fetch('/api/teams');
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const data = await response.json();
        dispatch(setTeams(data));
      } catch (err) {
        console.log('Using mock data as fallback:', mockTeams);
        // Use mock data as fallback
        dispatch(setTeams(mockTeams));
      }
    };

    fetchTeams();
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Failed to load teams. Please try again later.
        </div>
      </div>
    );
  }

  if (loading) {
    return <TeamsLoadingState />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-gray-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
        </div>
        <CreateTeamDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        </CreateTeamDialog>
      </div>

      {teams.length === 0 ? (
        <TeamsEmptyState />
      ) : (
        <TeamsList teams={teams} />
      )}
    </div>
  );
};

export default Teams;
