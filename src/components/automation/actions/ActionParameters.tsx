
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { CustomAction } from '@/types/action';

interface ActionParametersProps {
  parameters: CustomAction['parameters'];
  onChange: (parameters: CustomAction['parameters']) => void;
}

export const ActionParameters = ({ parameters, onChange }: ActionParametersProps) => {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(parameters, null, 2));

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    try {
      const parsedParams = JSON.parse(value);
      if (!Array.isArray(parsedParams)) {
        throw new Error('Parameters must be an array');
      }

      // Validate each parameter has required fields
      const validParams = parsedParams.map(param => ({
        id: param.id || crypto.randomUUID(),
        name: param.name || '',
        type: param.type || 'string',
        description: param.description || '',
        required: param.required ?? true,
        defaultValue: param.defaultValue,
        dependencies: param.dependencies || [],
        visible: param.visible ?? true,
      }));

      onChange(validParams);
      toast({
        title: "Parameters updated",
        description: "The parameters have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: error instanceof Error ? error.message : "Please check your JSON format",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parameters</CardTitle>
        <Button
          variant="outline"
          onClick={() => {
            setJsonInput(JSON.stringify(parameters, null, 2));
            toast({
              title: "Parameters reset",
              description: "The JSON has been reset to the current parameters.",
            });
          }}
        >
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="parameters">Parameters JSON</Label>
          <Textarea
            id="parameters"
            value={jsonInput}
            onChange={(e) => handleJsonChange(e.target.value)}
            className="min-h-[400px] font-mono"
            placeholder={`[
  {
    "name": "userId",
    "type": "string",
    "description": "The user's ID",
    "required": true
  }
]`}
          />
        </div>
      </CardContent>
    </Card>
  );
};
