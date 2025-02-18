
import { Card } from '@/components/ui/card';
import { ActionList } from '@/components/automation/actions/ActionList';
import { ActionHeader } from '@/components/automation/actions/ActionHeader';

const ActionCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <ActionHeader />
        <Card className="p-6">
          <ActionList />
        </Card>
      </div>
    </div>
  );
};

export default ActionCenter;
