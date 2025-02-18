
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleAction, deleteAction } from '@/store/slices/actions/actionsSlice';
import { toast } from 'sonner';
import ActionDetailHeader from './components/ActionDetailHeader';
import ActionStatusHeader from './components/ActionStatusHeader';
import ActionBasicInfo from './components/ActionBasicInfo';
import ActionApiConfig from './components/ActionApiConfig';
import ActionParameters from './components/ActionParameters';

const ActionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  console.log('Rendering ActionDetail with ID:', id);

  const action = useAppSelector((state) => {
    console.log('Redux state:', state);
    console.log('Actions in store:', state.actions.items);
    return state.actions.items.find(item => {
      console.log('Comparing item.id:', item.id, 'with param id:', id);
      return item.id === id;
    });
  });

  console.log('Found action:', action);

  if (!id) {
    console.log('No ID provided');
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="py-8">
            <p className="text-center text-muted-foreground">Invalid action ID</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!action) {
    console.log('No action found for ID:', id);
    return (
      <div className="container mx-auto px-4 py-8">
        <ActionDetailHeader />
        <Card>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-center text-muted-foreground">Action not found</p>
          </div>
        </Card>
      </div>
    );
  }

  const handleToggle = () => {
    dispatch(toggleAction(action.id));
    toast.success(`Action ${action.enabled ? 'disabled' : 'enabled'} successfully`);
  };

  const handleDelete = () => {
    dispatch(deleteAction(action.id));
    toast.success('Action deleted successfully');
    navigate('/home/automation/ai/action-center');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <ActionDetailHeader />

      <div className="space-y-6">
        <Card>
          <ActionStatusHeader 
            action={action}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <ActionBasicInfo action={action} />
          <ActionApiConfig action={action} />
          <ActionParameters action={action} />
        </div>
      </div>
    </div>
  );
};

export default ActionDetail;

