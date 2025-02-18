
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import type { CustomAction } from '@/types/action';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteAction, toggleAction } from '@/store/slices/actions/actionsSlice';
import { useNavigate } from 'react-router-dom';

interface ActionListItemProps {
  action: CustomAction;
}

export function ActionListItem({ action }: ActionListItemProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleAction(action.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteAction(action.id));
  };

  const handleCardClick = () => {
    navigate(`/home/automation/ai/action-center/${action.id}`);
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {action.name}
              <Badge variant={action.enabled ? 'default' : 'secondary'}>
                {action.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </CardTitle>
            <CardDescription>{action.description}</CardDescription>
          </div>
          <Switch 
            checked={action.enabled} 
            onCheckedChange={() => dispatch(toggleAction(action.id))}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Endpoint:</span> {action.endpoint}
          </div>
          <div>
            <span className="font-medium">Method:</span>{' '}
            <Badge variant="outline">{action.method}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
