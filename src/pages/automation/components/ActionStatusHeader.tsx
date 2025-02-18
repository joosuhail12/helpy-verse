
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { CustomAction } from '@/types/action';

interface ActionStatusHeaderProps {
  action: CustomAction;
  onToggle: () => void;
  onDelete: () => void;
}

const ActionStatusHeader = ({ action, onToggle, onDelete }: ActionStatusHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            {action.name}
            <Badge variant={action.enabled ? 'default' : 'secondary'}>
              {action.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Created by {action.createdBy.name} on {new Date(action.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Switch
            checked={action.enabled}
            onCheckedChange={onToggle}
          />
          <Button
            variant="destructive"
            onClick={onDelete}
          >
            Delete Action
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default ActionStatusHeader;

