
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { updateTeamAction } from '@/pages/settings/teams/utils/updateTeamUtils';
import type { Team } from '@/types/team';

import { useTeamFormData } from './teams/useTeamFormData';
import { useTeamMembers } from './teams/useTeamMembers';
import { useTeamChannels } from './teams/useTeamChannels';
import { useTeamRouting } from './teams/useTeamRouting';
import { useTeamAvailability } from './teams/useTeamAvailability';
import { 
  extractTeamMemberIds, 
  extractChannelData, 
  extractRoutingData, 
  extractOfficeHours, 
  extractHolidays,
  prepareTeamDataForSubmission
} from './teams/teamFormUtils';

export const useTeamEditForm = (team: Team, onSuccess?: () => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Basic team information
  const { teamName, setTeamName, selectedIcon, setSelectedIcon, isSubmitDisabled } = useTeamFormData(team);
  
  // Team members
  const { selectedTeammates, setSelectedTeammates, toggleTeammate } = useTeamMembers();
  
  // Team channels
  const { 
    selectedChatChannel, 
    setSelectedChatChannel,
    selectedEmailChannels,
    handleEmailChannelToggle 
  } = useTeamChannels();

  // Team routing settings
  const { routingType, setRoutingType, routingLimits, setRoutingLimits } = useTeamRouting();
  
  // Team availability
  const { 
    officeHours, 
    setOfficeHours, 
    selectedHolidays, 
    setSelectedHolidays 
  } = useTeamAvailability();

  // Initialize form data from team object
  useEffect(() => {
    if (team) {
      // Set team members
      setSelectedTeammates(extractTeamMemberIds(team));
      
      // Set channel data
      const { chatChannel, emailChannels } = extractChannelData(team);
      setSelectedChatChannel(chatChannel);
      
      // Extract and set routing data
      const { routingType: extractedRoutingType, routingLimits: extractedRoutingLimits } = extractRoutingData(team);
      setRoutingType(extractedRoutingType);
      setRoutingLimits(extractedRoutingLimits);
      
      // Set office hours and holidays
      setOfficeHours(extractOfficeHours(team));
      setSelectedHolidays(extractHolidays(team));
    }
  }, [team]);

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
      
      // Prepare the data in the format expected by the backend
      const teamData = prepareTeamDataForSubmission(
        teamName,
        selectedIcon,
        selectedTeammates,
        selectedChatChannel,
        selectedEmailChannels,
        routingType,
        routingLimits,
        officeHours,
        selectedHolidays
      );

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
    isSubmitDisabled
  };
};
