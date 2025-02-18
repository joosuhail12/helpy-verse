
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ActionHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Action Center</h1>
        <p className="text-muted-foreground mt-1">
          Manage and configure custom API actions for your automation workflows
        </p>
      </div>
      <Button asChild>
        <Link to="/home/automation/ai/action-center/create">
          <Plus className="h-4 w-4 mr-2" />
          Create Action
        </Link>
      </Button>
    </div>
  );
}
