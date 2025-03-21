
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface TeamEditActionsProps {
  teamId: string;
  teamName: string;
  onUpdateTeam: () => void;
  isSubmitDisabled: boolean;
}

const TeamEditActions = ({ 
  teamId, 
  teamName,
  onUpdateTeam, 
  isSubmitDisabled 
}: TeamEditActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-4 mt-4">
      <Button
        variant="outline"
        onClick={() => navigate(`/home/settings/teams/${teamId}`)}
      >
        Cancel
      </Button>
      <Button
        onClick={onUpdateTeam}
        disabled={isSubmitDisabled}
        className="px-8"
      >
        Update Team
      </Button>
    </div>
  );
};

export default TeamEditActions;
