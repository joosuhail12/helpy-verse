
import { CustomAction } from '@/types/action';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleAction } from '@/store/slices/actions/actionsSlice';

interface ActionDetailHeaderProps {
  action: CustomAction;
}

export function ActionDetailHeader({ action }: ActionDetailHeaderProps) {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(toggleAction(action.id));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{action.name}</h1>
        <p className="text-muted-foreground">{action.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={action.enabled ? 'default' : 'secondary'}>
          {action.enabled ? 'Enabled' : 'Disabled'}
        </Badge>
        <Switch 
          checked={action.enabled} 
          onCheckedChange={handleToggle}
        />
      </div>
    </div>
  );
}
