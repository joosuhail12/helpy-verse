
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleAction, deleteAction } from '@/store/slices/actions/actionsSlice';
import { toast } from 'sonner';

const ActionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  console.log('Current action ID:', id);

  const action = useAppSelector((state) => {
    console.log('Redux state:', state.actions.items);
    return state.actions.items.find(item => item.id === id);
  });

  console.log('Found action:', action);

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Invalid action ID</p>
          </CardContent>
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

  if (!action) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/home/automation/ai/action-center')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Action Center
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-center text-muted-foreground">Action not found</p>
            <Button onClick={() => navigate('/home/automation/ai/action-center')}>
              Return to Action Center
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/home/automation/ai/action-center')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Action Center
      </Button>

      <div className="space-y-6">
        <Card>
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
                  onCheckedChange={handleToggle}
                />
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Action
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                  <dd className="mt-1">{action.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Tool Name</dt>
                  <dd className="mt-1">{action.toolName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="mt-1">{new Date(action.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Endpoint</dt>
                  <dd className="mt-1 font-mono text-sm">{action.endpoint}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Method</dt>
                  <dd className="mt-1">
                    <Badge variant="outline">{action.method}</Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Headers</dt>
                  <dd className="mt-1">
                    <pre className="text-sm bg-muted p-2 rounded-md overflow-x-auto">
                      {JSON.stringify(action.headers, null, 2)}
                    </pre>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {action.parameters.map((param) => (
                  <div key={param.id} className="flex items-start gap-4 p-4 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{param.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{param.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{param.type}</Badge>
                        {param.required && <Badge>Required</Badge>}
                      </div>
                    </div>
                    {param.defaultValue && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Default:</span>
                        <code className="ml-2 p-1 rounded bg-muted">{param.defaultValue}</code>
                      </div>
                    )}
                  </div>
                ))}
                {action.parameters.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No parameters defined for this action
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActionDetail;

