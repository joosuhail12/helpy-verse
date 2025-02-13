
import { useState } from 'react';
import { mockCannedResponses, type CannedResponse } from '@/mock/cannedResponses';
import { CannedResponseList } from '@/components/settings/cannedResponses/CannedResponseList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CannedResponses = () => {
  const [responses] = useState<CannedResponse[]>(mockCannedResponses);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Canned Responses</h1>
          <p className="text-muted-foreground">
            Create and manage your team's canned responses for quick replies
          </p>
        </div>
        <Link to="/home/settings/canned-responses/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Response
          </Button>
        </Link>
      </div>

      <CannedResponseList responses={responses} />
    </div>
  );
};

export default CannedResponses;
