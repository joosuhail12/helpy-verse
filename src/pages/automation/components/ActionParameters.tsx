
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CustomAction } from '@/types/action';

interface ActionParametersProps {
  action: CustomAction;
}

const ActionParameters = ({ action }: ActionParametersProps) => {
  return (
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
  );
};

export default ActionParameters;

