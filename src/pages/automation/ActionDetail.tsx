
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EditActionDialog } from '@/components/automation/actions/EditActionDialog';
import { PenLine, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ActionDetail = () => {
  const { actionId } = useParams();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const action = useAppSelector(state => 
    state.actions.items.find(item => item.id === actionId)
  );

  useEffect(() => {
    if (!action) {
      toast({
        title: "Action not found",
        description: "The requested action could not be found.",
        variant: "destructive",
      });
    }
  }, [action]);

  if (!action) {
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
          <h1 className="text-2xl font-bold">{action.name}</h1>
          <Badge variant={action.enabled ? 'default' : 'secondary'}>
            {action.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <Button onClick={() => setIsEditDialogOpen(true)}>
          <PenLine className="h-4 w-4 mr-2" />
          Edit Action
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{action.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tool Name</h3>
              <p className="mt-1">{action.toolName}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Endpoint</h3>
              <p className="mt-1 font-mono">{action.endpoint}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Method</h3>
              <Badge variant="outline" className="mt-1">{action.method}</Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Headers</h3>
              <pre className="mt-1 p-2 bg-muted rounded-md text-sm">
                {JSON.stringify(action.headers, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {action.parameters.map((param) => (
                <div key={param.id}>
                  <h3 className="text-sm font-medium">{param.name}</h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-muted-foreground">{param.description}</p>
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

      <EditActionDialog
        action={action}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default ActionDetail;
