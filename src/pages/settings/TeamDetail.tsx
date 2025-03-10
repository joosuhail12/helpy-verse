import TeamAvailability from '@/components/teams/detail/TeamAvailability';
import TeamChannels from '@/components/teams/detail/TeamChannels';
import TeamMembers from '@/components/teams/detail/TeamMembers';
import TeamRouting from '@/components/teams/detail/TeamRouting';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeamById } from '@/store/slices/teams/teamsSlice';
import { ArrowLeft, Building2 } from "lucide-react";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, teamDetails } = useAppSelector((state) => state.teams);
  const team = teamDetails

  useEffect(() => {
    if (id) {
      dispatch(fetchTeamById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <TeamsLoadingState />;
  }

  if (!team || error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error || "Team not found. The team might have been deleted or you may not have access to it."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home/settings/teams')}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900">{team.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Team Members</h2>
          <TeamMembers teamMembers={team.teamMembers} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Communication Channels</h2>
          <TeamChannels channels={team.channels} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Ticket Routing</h2>
          <TeamRouting routingStrategy={team.routingStrategy} maxTickets={team.maxTickets} maxOpenTickets={team.maxOpenTickets} maxActiveChats={team.maxActiveChats} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Team Availability</h2>
          <TeamAvailability officeHours={team.officeHours} holidays={team.holidays} />
        </Card>
      </div>
    </div>
  );
};

export default TeamDetail;
