
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateAction } from '@/store/slices/actions/actionsSlice';
import type { CustomAction } from '@/types/action';

const ActionDetail = () => {
  console.log('ActionDetail: Component mounting');
  const { actionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  console.log('ActionDetail: Current actionId:', actionId);
  
  const action = useAppSelector(state => {
    console.log('ActionDetail: Current Redux State:', state);
    return state.actions.items.find(item => item.id === actionId)
  });

  const [editedAction, setEditedAction] = useState<CustomAction | null>(null);

  useEffect(() => {
    console.log('ActionDetail: Action from Redux:', action);
    if (action) {
      console.log('ActionDetail: Setting edited action');
      setEditedAction(action);
    }
  }, [action]);

  useEffect(() => {
    if (!action) {
      console.log('ActionDetail: Action not found, showing toast');
      toast({
        title: "Action not found",
        description: "The requested action could not be found.",
        variant: "destructive",
      });
    }
  }, [action]);

  const handleSave = () => {
    if (editedAction) {
      console.log('ActionDetail: Saving changes:', editedAction);
      dispatch(updateAction(editedAction));
      toast({
        title: "Changes saved",
        description: "The action has been updated successfully.",
      });
    }
  };

  if (!action || !editedAction) {
    console.log('ActionDetail: Rendering not found state');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate('/home/automation/ai/action-center')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Action Center
          </Button>
          <h1 className="text-2xl font-bold">Action not found</h1>
        </div>
      </div>
    );
  }

  console.log('ActionDetail: Rendering main content');
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/home/automation/ai/action-center')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Input
            value={editedAction.name}
            onChange={(e) => setEditedAction({ ...editedAction, name: e.target.value })}
            className="text-2xl font-bold h-auto px-2 py-1 max-w-[300px]"
          />
          <Badge variant={editedAction.enabled ? 'default' : 'secondary'}>
            {editedAction.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <Textarea
                value={editedAction.description}
                onChange={(e) => setEditedAction({ ...editedAction, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tool Name</h3>
              <Input
                value={editedAction.toolName}
                onChange={(e) => setEditedAction({ ...editedAction, toolName: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Endpoint</h3>
              <Input
                value={editedAction.endpoint}
                onChange={(e) => setEditedAction({ ...editedAction, endpoint: e.target.value })}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Method</h3>
              <Badge variant="outline">{editedAction.method}</Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Headers</h3>
              <Textarea
                value={JSON.stringify(editedAction.headers, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    setEditedAction({ ...editedAction, headers });
                  } catch (error) {
                    // Don't update if JSON is invalid
                  }
                }}
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {editedAction.parameters.map((param) => (
                <div key={param.id}>
                  <Input
                    value={param.name}
                    onChange={(e) => {
                      const updatedParams = editedAction.parameters.map(p => 
                        p.id === param.id ? { ...p, name: e.target.value } : p
                      );
                      setEditedAction({ ...editedAction, parameters: updatedParams });
                    }}
                    className="font-medium mb-1"
                  />
                  <div className="mt-1 space-y-1">
                    <Textarea
                      value={param.description}
                      onChange={(e) => {
                        const updatedParams = editedAction.parameters.map(p => 
                          p.id === param.id ? { ...p, description: e.target.value } : p
                        );
                        setEditedAction({ ...editedAction, parameters: updatedParams });
                      }}
                      className="text-sm text-muted-foreground"
                    />
                    <div className="flex gap-2">
                      <Badge variant="outline">{param.type}</Badge>
                      {param.required && <Badge variant="default">Required</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActionDetail;
