
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import TeamsEmptyState from '@/components/teams/TeamsEmptyState';
import TeamsList from '@/components/teams/TeamsList';
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { fetchTeams } from '@/store/slices/teams/teamsSlice';
import { selectAllTeams, selectTeamsLoading, selectTeamsError } from '@/store/slices/teams/selectors';

const Teams = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectAllTeams);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);

  useEffect(() => {
    // Fetch teams from API on component mount
    // Pass an empty object as params to meet the expected arguments
    dispatch(fetchTeams({}));
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Failed to load teams: {error}. Please try again later.
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
        <Button onClick={() => navigate('/home/settings/teams/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
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
