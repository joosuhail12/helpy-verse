
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { CustomAction } from '@/types/action';

interface ActionParametersProps {
  parameters: CustomAction['parameters'];
  onParameterChange: (parameters: CustomAction['parameters']) => void;
}

export const ActionParameters = ({ parameters, onParameterChange }: ActionParametersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parameters.map((param) => (
            <div key={param.id}>
              <Input
                value={param.name}
                onChange={(e) => {
                  const updatedParams = parameters.map(p => 
                    p.id === param.id ? { ...p, name: e.target.value } : p
                  );
                  onParameterChange(updatedParams);
                }}
                className="font-medium mb-1"
              />
              <div className="mt-1 space-y-1">
                <Textarea
                  value={param.description}
                  onChange={(e) => {
                    const updatedParams = parameters.map(p => 
                      p.id === param.id ? { ...p, description: e.target.value } : p
                    );
                    onParameterChange(updatedParams);
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
  );
};

