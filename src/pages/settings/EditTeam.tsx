
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, ArrowLeft, Pencil } from "lucide-react";
import TeamBasicInfo from './teams/components/TeamBasicInfo';
import TeamCommunicationSection from './teams/components/TeamCommunicationSection';
import TeamRoutingSection from './teams/components/TeamRoutingSection';
import TeamAvailabilitySection from './teams/components/TeamAvailabilitySection';
import { updateTeam } from './teams/utils/updateTeamUtils';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import type { DayOfWeek, TimeSlot, Team, Channel, RoutingRule } from '@/types/team';

const EditTeam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammates = useAppSelector((state) => state.teammates.teammates);
  const { teams, loading, error } = useAppSelector((state) => state.teams);
  const team = teams.find(t => t.id === id);

  const [teamName, setTeamName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [selectedChatChannel, setSelectedChatChannel] = useState<string>();
  const [selectedEmailChannels, setSelectedEmailChannels] = useState<string[]>([]);
  const [routingType, setRoutingType] = useState<'manual' | 'round-robin' | 'load-balanced'>('manual');
  const [routingLimits, setRoutingLimits] = useState<{
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }>({});
  const [officeHours, setOfficeHours] = useState<{ [key in DayOfWeek]: TimeSlot[] }>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setSelectedIcon(team.icon || '');
      setSelectedTeammates(team.members.map(member => member.id));
      
      // Handle channels properly based on the actual structure
      if (team.channels) {
        if (typeof team.channels === 'object' && team.channels !== null && 'chat' in team.channels) {
          // New format (object with chat/email properties)
          const chatChannel = team.channels.chat as string | undefined;
          const emailChannels = (team.channels.email || []) as string[];
          setSelectedChatChannel(chatChannel);
          setSelectedEmailChannels(emailChannels);
        } else {
          // Old format (array of Channel objects)
          const channels = team.channels as unknown as Channel[];
          const chatChannel = channels.find(c => c.type === 'chat')?.id;
          const emailChannels = channels
            .filter(c => c.type === 'email')
            .map(c => c.id);
          
          setSelectedChatChannel(chatChannel);
          setSelectedEmailChannels(emailChannels);
        }
      }
      
      // Handle routing properly based on the actual structure
      if (team.routing) {
        if (typeof team.routing === 'object' && team.routing !== null && 'type' in team.routing) {
          // New format (object with type property)
          const routingType = team.routing.type as 'manual' | 'round-robin' | 'load-balanced';
          const routingLimits = team.routing.limits || {};
          setRoutingType(routingType);
          setRoutingLimits(routingLimits);
        } else {
          // Old format (array of RoutingRule objects)
          const routing = team.routing as unknown as RoutingRule[];
          const mainRule = routing[0];
          if (mainRule) {
            const routingType = (mainRule.type || 'manual') as 'manual' | 'round-robin' | 'load-balanced';
            setRoutingType(routingType);
          }
        }
      }
      
      // Handle officeHours properly
      if (team.officeHours) {
        if (typeof team.officeHours === 'object' && team.officeHours !== null && 'monday' in team.officeHours) {
          // Already in the correct format with day keys
          const typedOfficeHours = team.officeHours as unknown as { [key in DayOfWeek]: TimeSlot[] };
          setOfficeHours({
            monday: typedOfficeHours.monday || [],
            tuesday: typedOfficeHours.tuesday || [],
            wednesday: typedOfficeHours.wednesday || [],
            thursday: typedOfficeHours.thursday || [],
            friday: typedOfficeHours.friday || [],
            saturday: typedOfficeHours.saturday || [],
            sunday: typedOfficeHours.sunday || []
          });
        } else {
          // Convert from old format if needed
          const oldFormat = team.officeHours as unknown as {
            days: string[];
            startTime: string;
            endTime: string;
          };
          
          const days = oldFormat.days || [];
          const newFormat = {
            monday: days.includes('monday') ? [{ start: oldFormat.startTime, end: oldFormat.endTime }] : [],
            tuesday: days.includes('tuesday') ? [{ start: oldFormat.startTime, end: oldFormat.endTime }] : [],
            wednesday: days.includes('wednesday') ? [{ start: oldFormat.startTime, end: oldFormat.endTime }] : [],
            thursday: days.includes('thursday') ? [{ start: oldFormat.startTime, end: oldFormat.endTime }] : [],
            friday: days.includes('friday') ? [{ start: oldFormat.startTime, end: oldFormat.endTime }] : [],
            saturday: days.includes('saturday') ? [{ start: oldFormat.startTime, end: oldFormat.endTime }] : [],
            sunday: days.includes('sunday') ? [{ start: oldFormat.startTime, end: oldFormat.endTime }] : [],
          };
          setOfficeHours(newFormat);
        }
      }
      
      // Handle holidays properly
      if (team.holidays) {
        // Convert Holiday objects to strings if needed
        const holidayArray = Array.isArray(team.holidays) ? team.holidays : [];
        const holidayStrings = holidayArray.map((h: any) => 
          typeof h === 'string' ? h : (h && typeof h === 'object' && 'date' in h ? h.date : '')
        ).filter(Boolean);
        setSelectedHolidays(holidayStrings);
      }
    }
  }, [team]);

  const toggleTeammate = (teammateId: string) => {
    setSelectedTeammates(prev =>
      prev.includes(teammateId)
        ? prev.filter(id => id !== teammateId)
        : [...prev, teammateId]
    );
  };

  const handleEmailChannelToggle = (channelId: string) => {
    setSelectedEmailChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleUpdateTeam = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Team ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await updateTeam(id, {
        name: teamName,
        icon: selectedIcon,
        members: selectedTeammates,
        channels: {
          chat: selectedChatChannel,
          email: selectedEmailChannels,
        },
        routing: {
          type: routingType,
          ...(routingType === 'load-balanced' && {
            limits: routingLimits
          })
        },
        officeHours,
        holidays: selectedHolidays,
      });

      if (success) {
        toast({
          title: "Success",
          description: "Team updated successfully",
        });
        navigate(`/home/settings/teams/${id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/home/settings/teams/${id}`)}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Pencil className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900">Edit Team: {team?.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <TeamBasicInfo
          teamName={teamName}
          setTeamName={setTeamName}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          teammates={teammates}
          selectedTeammates={selectedTeammates}
          onTeammateToggle={toggleTeammate}
        />

        <TeamCommunicationSection
          selectedChatChannel={selectedChatChannel}
          selectedEmailChannels={selectedEmailChannels}
          onChatChannelSelect={setSelectedChatChannel}
          onEmailChannelToggle={handleEmailChannelToggle}
        />

        <TeamRoutingSection
          routingType={routingType}
          setRoutingType={setRoutingType}
          routingLimits={routingLimits}
          setRoutingLimits={setRoutingLimits}
        />

        <TeamAvailabilitySection
          officeHours={officeHours}
          onOfficeHoursChange={setOfficeHours}
          selectedHolidays={selectedHolidays}
          onHolidaysChange={setSelectedHolidays}
        />

        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/home/settings/teams/${id}`)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTeam}
            disabled={!teamName.trim()}
            className="px-8"
          >
            Update Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditTeam;
