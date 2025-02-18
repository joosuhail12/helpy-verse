
import { CustomAction } from '@/types/action';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActionDetailContentProps {
  action: CustomAction;
}

export function ActionDetailContent({ action }: ActionDetailContentProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Tool Name</h3>
            <p className="text-muted-foreground">{action.toolName}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Endpoint</h3>
            <p className="text-muted-foreground font-mono bg-muted p-2 rounded">{action.endpoint}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Method</h3>
            <Badge variant="outline">{action.method}</Badge>
          </div>
          <div>
            <h3 className="font-medium mb-2">Headers</h3>
            <pre className="bg-muted p-2 rounded overflow-x-auto">
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
          <div className="divide-y">
            {action.parameters.map((param) => (
              <div key={param.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{param.name}</h4>
                  <Badge variant={param.required ? 'default' : 'secondary'}>
                    {param.required ? 'Required' : 'Optional'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{param.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{param.type}</Badge>
                  {param.defaultValue && (
                    <span className="text-sm text-muted-foreground">
                      Default: {param.defaultValue}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Created By</h3>
            <div className="flex items-center gap-2">
              {action.createdBy.avatar && (
                <img 
                  src={action.createdBy.avatar} 
                  alt={action.createdBy.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>{action.createdBy.name}</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Created At</h3>
            <p className="text-muted-foreground">
              {new Date(action.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Last Updated</h3>
            <p className="text-muted-foreground">
              {new Date(action.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
