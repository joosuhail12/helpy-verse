
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, Building2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TeamMembers from '@/components/teams/detail/TeamMembers';
import TeamChannels from '@/components/teams/detail/TeamChannels';
import TeamRouting from '@/components/teams/detail/TeamRouting';
import TeamAvailability from '@/components/teams/detail/TeamAvailability';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import type { TimeSlot } from '@/types/team';

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { teams, loading, error } = useAppSelector((state) => state.teams);
  const team = teams.find(t => t.id === id);

  if (loading) {
    return <TeamsLoadingState />;
  }

  if (!team) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Team not found. The team might have been deleted or you may not have access to it.
        </div>
      </div>
    );
  }

  const formatChannels = (team: any) => {
    if (!team.channels) return { chat: undefined, email: [] };
    
    if ('email' in team.channels) return team.channels;
    
    const emailChannels = team.channels
      .filter((c: any) => c.type === 'email')
      .map((c: any) => c.id);
      
    const chatChannel = team.channels.find((c: any) => c.type === 'chat')?.id;
    
    return {
      chat: chatChannel,
      email: emailChannels,
    };
  };

  const formatRouting = (team: any) => {
    if (!team.routing) return { type: 'manual' };
    
    if ('type' in team.routing) return team.routing;
    
    const routingRule = Array.isArray(team.routing) && team.routing.length > 0 
      ? team.routing[0] 
      : { type: 'manual' };
      
    return {
      type: routingRule.type || 'manual',
      limits: team.limits || {},
    };
  };

  // Convert OfficeHours from store format to component format
  const formatOfficeHours = (officeHours: any) => {
    if (!officeHours) {
      return {
        monday: [] as TimeSlot[],
        tuesday: [] as TimeSlot[],
        wednesday: [] as TimeSlot[],
        thursday: [] as TimeSlot[],
        friday: [] as TimeSlot[],
        saturday: [] as TimeSlot[],
        sunday: [] as TimeSlot[],
      };
    }
    
    if (officeHours.monday) return officeHours; // Already in the correct format
    
    // Convert from store format if needed
    return {
      monday: officeHours.days?.includes('monday') ? [{ start: officeHours.startTime, end: officeHours.endTime }] : [],
      tuesday: officeHours.days?.includes('tuesday') ? [{ start: officeHours.startTime, end: officeHours.endTime }] : [],
      wednesday: officeHours.days?.includes('wednesday') ? [{ start: officeHours.startTime, end: officeHours.endTime }] : [],
      thursday: officeHours.days?.includes('thursday') ? [{ start: officeHours.startTime, end: officeHours.endTime }] : [],
      friday: officeHours.days?.includes('friday') ? [{ start: officeHours.startTime, end: officeHours.endTime }] : [],
      saturday: officeHours.days?.includes('saturday') ? [{ start: officeHours.startTime, end: officeHours.endTime }] : [],
      sunday: officeHours.days?.includes('sunday') ? [{ start: officeHours.startTime, end: officeHours.endTime }] : [],
    };
  };

  // Convert Holiday objects to string dates
  const formatHolidays = (holidays: any[]) => {
    if (!holidays) return [];
    
    return holidays.map((h: any) => typeof h === 'string' ? h : h.date);
  };

  const formattedTeam = {
    ...team,
    channels: formatChannels(team),
    routing: formatRouting(team),
    officeHours: formatOfficeHours(team.officeHours),
    holidays: formatHolidays(team.holidays)
  };

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
        <Button 
          onClick={() => navigate(`/home/settings/teams/${id}/edit`)}
          variant="outline"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Team
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Team Members</h2>
          <TeamMembers members={team.members} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Communication Channels</h2>
          <TeamChannels channels={formattedTeam.channels} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Ticket Routing</h2>
          <TeamRouting routing={formattedTeam.routing} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Team Availability</h2>
          <TeamAvailability officeHours={formattedTeam.officeHours} holidays={formattedTeam.holidays} />
        </Card>
      </div>
    </div>
  );
};

export default TeamDetail;
