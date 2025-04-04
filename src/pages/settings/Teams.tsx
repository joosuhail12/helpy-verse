
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import TeamsEmptyState from '@/components/teams/TeamsEmptyState';
import TeamsList from '@/components/teams/TeamsList';
import { Button } from "@/components/ui/button";
import { Plus, Users, AlertCircle, RefreshCw } from "lucide-react";
import { fetchTeams } from '@/store/slices/teams/teamsSlice';
import { selectAllTeams, selectTeamsLoading, selectTeamsError } from '@/store/slices/teams/selectors';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const Teams = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectAllTeams);
  const loading = useAppSelector(selectTeamsLoading);
  const error = useAppSelector(selectTeamsError);
  const [isRetrying, setIsRetrying] = useState(false);
  const { isAuthenticated, isLoading: authLoading, error: authError } = useAuthCheck();

  useEffect(() => {
    // Fetch teams from API only if authenticated
    if (isAuthenticated) {
      dispatch(fetchTeams({}));
    }
  }, [dispatch, isAuthenticated]);

  const handleRetry = () => {
    setIsRetrying(true);
    dispatch(fetchTeams({}))
      .finally(() => setIsRetrying(false));
  };

  if (authLoading || loading) {
    return <TeamsLoadingState />;
  }

  if (authError) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-2" />
            <h3 className="text-xl font-semibold mb-2">Authentication Error</h3>
            <p className="text-muted-foreground mb-4">{authError}</p>
            <p className="text-sm">Please sign in to view teams.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="font-medium text-destructive">Error loading teams</p>
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="flex gap-2 items-center"
          >
            {isRetrying && <RefreshCw className="h-4 w-4 animate-spin" />}
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        </Card>
      </div>
    );
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
