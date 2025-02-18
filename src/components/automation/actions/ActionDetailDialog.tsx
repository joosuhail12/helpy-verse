
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateAction } from '@/store/slices/actions/actionsSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CustomAction } from '@/types/action';

interface ActionDetailDialogProps {
  action: CustomAction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ActionDetailDialog = ({ action, open, onOpenChange }: ActionDetailDialogProps) => {
  const dispatch = useAppDispatch();
  const [editedAction, setEditedAction] = useState<CustomAction | null>(action);
  const [isTestSuccessful, setIsTestSuccessful] = useState(false);

  const handleSave = () => {
    if (editedAction) {
      dispatch(updateAction(editedAction));
      toast({
        title: "Changes saved",
        description: "The action has been updated successfully.",
      });
    }
  };

  const handleTest = async () => {
    try {
      // Here we'll make the actual API call to test the endpoint
      const response = await fetch(editedAction?.endpoint || '', {
        method: editedAction?.method,
        headers: editedAction?.headers || {},
      });
      
      if (response.ok) {
        setIsTestSuccessful(true);
        toast({
          title: "Test successful",
          description: "The API action was tested successfully.",
        });
      } else {
        throw new Error('API test failed');
      }
    } catch (error) {
      setIsTestSuccessful(false);
      toast({
        title: "Test failed",
        description: "The API action test was unsuccessful. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  if (!action || !editedAction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Action Details</TabsTrigger>
            <TabsTrigger value="test">Test API</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
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
          </TabsContent>

          <TabsContent value="test" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Test API Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Endpoint URL</h3>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{editedAction.endpoint}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Method</h3>
                  <Badge variant="outline">{editedAction.method}</Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Headers</h3>
                  <pre className="text-sm font-mono bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(editedAction.headers, null, 2)}
                  </pre>
                </div>
                <Button 
                  onClick={handleTest}
                  variant={isTestSuccessful ? "default" : "secondary"}
                  className="w-full"
                >
                  Test API Action
                </Button>
                {isTestSuccessful && (
                  <div className="text-sm text-green-600">
                    API test was successful. You can now enable this action.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
