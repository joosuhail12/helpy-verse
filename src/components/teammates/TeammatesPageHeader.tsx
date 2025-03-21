
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddTeammateDialog from '@/components/teammates/AddTeammateDialog';

interface TeammatesPageHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

/**
 * Header component for the teammates page with title and action buttons
 */
const TeammatesPageHeader: React.FC<TeammatesPageHeaderProps> = ({ 
  onRefresh, 
  isRefreshing 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Teammates</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <AddTeammateDialog />
      </div>
    </div>
  );
};

export default TeammatesPageHeader;
