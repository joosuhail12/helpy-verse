
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { updateTeamAction } from '@/pages/settings/teams/utils/updateTeamUtils';
import type { DayOfWeek, TimeSlot, Team } from '@/types/team';
import type { Teammate } from '@/types/teammate';

export const useTeamEditForm = (team: Team, onSuccess?: () => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

    if (!team.id) {
      toast({
        title: "Error",
        description: "Team ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Updating team with ID:', team.id);
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
      const result = await updateTeamAction(team.id, teamData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Team updated successfully",
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(`/home/settings/teams/${team.id}`);
        }
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

  return {
    teamName,
    setTeamName,
    selectedIcon,
    setSelectedIcon,
    selectedTeammates,
    toggleTeammate,
    selectedChatChannel,
    setSelectedChatChannel,
    selectedEmailChannels,
    handleEmailChannelToggle,
    routingType,
    setRoutingType,
    routingLimits,
    setRoutingLimits,
    officeHours,
    setOfficeHours,
    selectedHolidays,
    setSelectedHolidays,
    handleUpdateTeam,
    isSubmitDisabled: !teamName.trim()
  };
};
