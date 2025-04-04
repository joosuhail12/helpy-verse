
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TeammatesHeaderProps {
  onAddTeammate: () => void;
}

const TeammatesHeader: React.FC<TeammatesHeaderProps> = ({ onAddTeammate }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Teammates</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your team members and their account permissions.
        </p>
      </div>
      <Button onClick={onAddTeammate}>
        <Plus className="mr-2 h-4 w-4" />
        Add Teammate
      </Button>
    </div>
  );
};

export default TeammatesHeader;
