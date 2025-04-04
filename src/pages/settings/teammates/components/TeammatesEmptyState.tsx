
import * as React from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeammatesEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 space-y-6">
      <div className="bg-gray-100 p-6 rounded-full">
        <Users className="h-12 w-12 text-gray-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">No teammates yet</h3>
        <p className="text-gray-500 max-w-md">
          Invite team members to collaborate on customer support, sales, and other workflows.
        </p>
      </div>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add First Teammate
      </Button>
    </div>
  );
};

export default TeammatesEmptyState;
