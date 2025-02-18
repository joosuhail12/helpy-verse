
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CustomAction } from '@/types/action';

interface ActionApiConfigProps {
  action: CustomAction;
}

const ActionApiConfig = ({ action }: ActionApiConfigProps) => {
  return (
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
  );
};

export default ActionApiConfig;

