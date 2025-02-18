
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';
import { ActionDetailDialog } from './ActionDetailDialog';
import type { CustomAction } from '@/types/action';

interface ActionListItemProps {
  action: CustomAction;
}

export const ActionListItem = ({ action }: ActionListItemProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{action.name}</h3>
            <Badge variant={action.enabled ? 'default' : 'secondary'}>
              {action.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{action.description}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowDialog(true)}>
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <ActionDetailDialog
        action={action}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};
