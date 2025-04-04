
import React from 'react';
import { Button } from '@/components/ui/button';
import { UsersRound, Plus } from 'lucide-react';

interface TeammatesEmptyStateProps {
  onAddTeammate: () => void;
}

const TeammatesEmptyState: React.FC<TeammatesEmptyStateProps> = ({ onAddTeammate }) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-white">
      <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <UsersRound className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No teammates yet</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Get started by adding your first teammate. Team members can be assigned different roles with varying permissions.
      </p>
      <Button onClick={onAddTeammate}>
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Teammate
      </Button>
    </div>
  );
};

export default TeammatesEmptyState;
