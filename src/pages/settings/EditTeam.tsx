
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
import { updateTeamAction } from './teams/utils/updateTeamUtils';
import TeamsLoadingState from '@/components/teams/TeamsLoadingState';
import type { DayOfWeek, TimeSlot } from '@/types/team';

const EditTeam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammates = useAppSelector((state) => state.teammates.teammates);
  const { teams, loading, error } = useAppSelector((state) => state.teams);
  const team = teams.find(t => t.id === id);

  console.log('Team data in EditTeam:', team);

  const [teamName, setTeamName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [selectedChatChannel, setSelectedChatChannel] = useState<string | undefined>('');
  const [selectedEmailChannels, setSelectedEmailChannels] = useState<string[]>([]);
  const [routingType, setRoutingType] = useState<'manual' | 'round-robin' | 'load-balanced'>('manual');
  const [routingLimits, setRoutingLimits] = useState<{
    maxTotalTickets?: number;
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
      console.log('Team data loaded for editing:', team);
      setTeamName(team.name || '');
      setSelectedIcon(team.icon || '');
      
      // Handle different member formats
      if (team.teamMembers && Array.isArray(team.teamMembers) && team.teamMembers.length > 0) {
        setSelectedTeammates(team.teamMembers.map(member => member.id));
      } else if (team.members && Array.isArray(team.members) && team.members.length > 0) {
        setSelectedTeammates(team.members);
      } else {
        setSelectedTeammates([]);
      }
      
      // Handle channels
      if (team.channels) {
        setSelectedChatChannel(team.channels.chat);
        setSelectedEmailChannels(Array.isArray(team.channels.email) ? team.channels.email : []);
      } else {
        setSelectedEmailChannels([]);
      }
      
      // Handle routing - use routingStrategy directly
      if (team.routingStrategy) {
        const routingType = team.routingStrategy as 'manual' | 'round-robin' | 'load-balanced';
        setRoutingType(routingType);
        
        // Set routing limits
        if (routingType === 'load-balanced') {
          setRoutingLimits({
            maxTotalTickets: team.maxTotalTickets,
            maxOpenTickets: team.maxOpenTickets,
            maxActiveChats: team.maxActiveChats
          });
        }
      }
      
      // Handle office hours and holidays
      if (team.officeHours) {
        // Create a copy of the default structure
        const safeOfficeHours = {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        };
        
        // Merge with actual data, ensuring each day has a valid array
        Object.keys(safeOfficeHours).forEach(day => {
          safeOfficeHours[day as DayOfWeek] = Array.isArray(team.officeHours?.[day as DayOfWeek]) 
            ? team.officeHours[day as DayOfWeek] 
            : [];
        });
        
        setOfficeHours(safeOfficeHours);
      }
      
      if (team.holidays) {
        setSelectedHolidays(Array.isArray(team.holidays) ? team.holidays : []);
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
      console.log('Updating team with ID:', id);
      const teamData = {
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
            limits: {
              maxTotalTickets: routingLimits.maxTotalTickets,
              maxOpenTickets: routingLimits.maxOpenTickets,
              maxActiveChats: routingLimits.maxActiveChats
            }
          })
        },
        officeHours,
        holidays: selectedHolidays,
      };

      console.log('Team data being submitted:', teamData);
      const result = await updateTeamAction(id, teamData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Team updated successfully",
        });
        navigate(`/home/settings/teams/${id}`);
      }
    } catch (error) {
      console.error("Update team error:", error);
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
