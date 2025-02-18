
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
import { Edit2, Trash2, FileText } from 'lucide-react';
import type { CustomAction } from '@/types/action';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { deleteAction, toggleAction } from '@/store/slices/actions/actionsSlice';
import { EditActionDialog } from './EditActionDialog';
import { useNavigate } from 'react-router-dom';

interface ActionListItemProps {
  action: CustomAction;
}

export function ActionListItem({ action }: ActionListItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleToggle = () => {
    dispatch(toggleAction(action.id));
  };

  const handleDelete = () => {
    dispatch(deleteAction(action.id));
  };

  const handleViewDetails = () => {
    navigate(`/home/automation/ai/action-center/${action.id}`);
  };

  return (
    <Card>
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
            onCheckedChange={handleToggle}
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
          variant="outline" 
          size="sm"
          onClick={handleViewDetails}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowEditDialog(true)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
      <EditActionDialog 
        action={action}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </Card>
  );
}
