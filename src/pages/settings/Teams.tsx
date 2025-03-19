
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import TeamsEmptyState from '@/components/teams/TeamsEmptyState';
import TeamsList from '@/components/teams/TeamsList';
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { fetchTeams, setTeams } from '@/store/slices/teams/teamsSlice';
import { mockTeams } from '@/store/slices/teams/mockData';
import type { Team } from '@/types/team';

const Teams = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { teams, loading, error } = useAppSelector((state) => state.teams);

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        dispatch(fetchTeams());
      } catch (err) {
        console.log('Using mock data as fallback:', mockTeams);
        // Ensure the mock data is properly formatted with all required fields
        const formattedTeams = mockTeams.map(team => ({
          ...team,
          // Make sure all required properties are present
          icon: team.icon || 'users',
          status: team.status || 'active',
          type: team.type || 'support',
          memberCount: team.members?.length || 0,
          members: team.members || [],
          officeHours: {
            days: team.officeHours?.days || [],
            startTime: team.officeHours?.startTime || '09:00',
            endTime: team.officeHours?.endTime || '17:00',
            timezone: team.officeHours?.timezone || 'UTC',
          },
          channels: team.channels || [],
          routing: team.routing || [],
          holidays: team.holidays || [],
        }));
        
        dispatch(setTeams(formattedTeams as any));
      }
    };

    fetchTeamsData();
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
