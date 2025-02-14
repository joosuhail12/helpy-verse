
import { useState } from 'react';
import { mockCannedResponses, type CannedResponse } from '@/mock/cannedResponses';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ViewToggle } from '@/components/settings/cannedResponses/ViewToggle';
import { CategoryGroup } from '@/components/settings/cannedResponses/CategoryGroup';

const CannedResponses = () => {
  const [responses] = useState<CannedResponse[]>(mockCannedResponses);
  const [view, setView] = useState<'list' | 'grid'>('list');

  // Group responses by category
  const groupedResponses = responses.reduce((acc, response) => {
    const category = response.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(response);
    return acc;
  }, {} as Record<string, CannedResponse[]>);

  const handleResponseClick = (id: string) => {
    // Navigate to edit page
    window.location.href = `/home/settings/canned-responses/${id}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Canned Responses</h1>
          <p className="text-muted-foreground">
            Create and manage your team's canned responses for quick replies
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Link to="/home/settings/canned-responses/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Response
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedResponses).map(([category, categoryResponses]) => (
          <CategoryGroup
            key={category}
            category={category}
            responses={categoryResponses}
            view={view}
            onResponseClick={handleResponseClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CannedResponses;
