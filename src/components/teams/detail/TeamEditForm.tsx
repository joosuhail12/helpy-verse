
import React from 'react';
import { useTeamEditForm } from '@/hooks/useTeamEditForm';
import TeamBasicInfo from '@/pages/settings/teams/components/TeamBasicInfo';
import TeamCommunicationSection from '@/pages/settings/teams/components/TeamCommunicationSection';
import TeamRoutingSection from '@/pages/settings/teams/components/TeamRoutingSection';
import TeamAvailabilitySection from '@/pages/settings/teams/components/TeamAvailabilitySection';
import TeamEditActions from './TeamEditActions';
import type { Team } from '@/types/team';
import type { Teammate } from '@/types/teammate';

interface TeamEditFormProps {
  team: Team;
  teammates: Teammate[];
  onSuccess?: () => void;
}

const TeamEditForm = ({ team, teammates, onSuccess }: TeamEditFormProps) => {
  const {
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
  } = useTeamEditForm(team, onSuccess);

  return (
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

      <TeamEditActions
        teamId={team.id}
        teamName={teamName}
        onUpdateTeam={handleUpdateTeam}
        isSubmitDisabled={isSubmitDisabled}
      />
    </div>
  );
};

export default TeamEditForm;
