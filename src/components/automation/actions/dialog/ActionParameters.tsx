
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { CustomAction } from '@/types/action';
import { v4 as uuidv4 } from 'uuid';

interface ActionParametersProps {
  parameters: CustomAction['parameters'];
  onParameterChange: (parameters: CustomAction['parameters']) => void;
}

export const ActionParameters = ({ parameters, onParameterChange }: ActionParametersProps) => {
  const handleAddParameter = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const newParameter = {
      id: uuidv4(),
      name: '',
      type: 'string' as const,
      description: '',
      required: true,
    };
    onParameterChange([...parameters, newParameter]);
  };

  const handleDeleteParameter = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent form submission
    const updatedParams = parameters.filter(param => param.id !== id);
    onParameterChange(updatedParams);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parameters</CardTitle>
        <Button 
          type="button" // Explicitly set button type
          variant="outline" 
          size="sm" 
          onClick={handleAddParameter}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Parameter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-2 pb-4 border-b last:border-0">
              <div className="flex items-center gap-2">
                <Input
                  value={param.name}
                  onChange={(e) => {
                    const updatedParams = parameters.map(p => 
                      p.id === param.id ? { ...p, name: e.target.value } : p
                    );
                    onParameterChange(updatedParams);
                  }}
                  placeholder="Parameter name"
                  className="font-medium"
                />
                <Button
                  type="button" // Explicitly set button type
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteParameter(e, param.id)}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
              <div className="space-y-2">
                <Textarea
                  value={param.description}
                  onChange={(e) => {
                    const updatedParams = parameters.map(p => 
                      p.id === param.id ? { ...p, description: e.target.value } : p
                    );
                    onParameterChange(updatedParams);
                  }}
                  placeholder="Parameter description"
                  className="text-sm text-muted-foreground"
                />
                <div className="flex gap-2">
                  <Badge variant="outline">{param.type}</Badge>
                  {param.required && <Badge variant="default">Required</Badge>}
                </div>
              </div>
            </div>
          ))}
          {parameters.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No parameters added yet. Click "Add Parameter" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
