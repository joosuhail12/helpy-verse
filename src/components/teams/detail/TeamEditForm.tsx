
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import TeamBasicInfo from '@/pages/settings/teams/components/TeamBasicInfo';
import TeamCommunicationSection from '@/pages/settings/teams/components/TeamCommunicationSection';
import TeamRoutingSection from '@/pages/settings/teams/components/TeamRoutingSection';
import TeamAvailabilitySection from '@/pages/settings/teams/components/TeamAvailabilitySection';
import { updateTeam } from '@/store/slices/teams/teamsSlice';
import type { Team } from '@/types/team';
import type { Teammate } from '@/types/teammate';
import type { DayOfWeek, TimeSlot } from '@/types/team';

interface TeamEditFormProps {
  team: Team;
  teammates: Teammate[];
  onSuccess?: () => void;
}

const TeamEditForm = ({ team, teammates, onSuccess }: TeamEditFormProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const [name, setName] = useState(team.name);
  const [icon, setIcon] = useState(team.icon || '👥');
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>(
    team.teamMembers?.map(member => member.id) || []
  );
  const [selectedChatChannel, setSelectedChatChannel] = useState<string | undefined>(
    team.channels?.chat
  );
  const [selectedEmailChannels, setSelectedEmailChannels] = useState<string[]>(
    team.channels?.email || []
  );
  const [routingType, setRoutingType] = useState<'manual' | 'round-robin' | 'load-balanced'>(
    team.routingStrategy || 'manual'
  );
  const [routingLimits, setRoutingLimits] = useState({
    maxTotalTickets: team.maxTotalTickets,
    maxOpenTickets: team.maxOpenTickets,
    maxActiveChats: team.maxActiveChats,
  });
  const [officeHours, setOfficeHours] = useState<{ [key in DayOfWeek]: TimeSlot[] }>(
    team.officeHours || {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [],
      sunday: []
    }
  );
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>(team.holidays || []);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const teamData = {
        id: team.id,
        name,
        icon,
        members: selectedTeammates,
        channels: {
          chat: selectedChatChannel,
          email: selectedEmailChannels,
        },
        routingStrategy: routingType,
        maxTotalTickets: routingLimits.maxTotalTickets,
        maxOpenTickets: routingLimits.maxOpenTickets,
        maxActiveChats: routingLimits.maxActiveChats,
        officeHours,
        holidays: selectedHolidays,
      };

      await dispatch(updateTeam({ id: team.id, data: teamData })).unwrap();
      
      toast({
        title: "Success",
        description: "Team updated successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-8">
      <TeamBasicInfo
        name={name}
        setName={setName}
        icon={icon}
        setIcon={setIcon}
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
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateTeam}
          disabled={!name.trim() || isSaving}
          className="px-8"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default TeamEditForm;
