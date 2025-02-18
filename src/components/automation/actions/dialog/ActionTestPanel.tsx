
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestParameterInput } from './parameter/TestParameterInput';
import { ResponseDetails } from './parameter/ResponseDetails';
import { toast } from '@/hooks/use-toast';
import type { TestPanelProps } from './parameter/types/testConfig';
import { Save } from 'lucide-react';

export const ActionTestPanel = ({ form, isTestSuccessful, onTest, parameters, testConfig, onSaveConfig }: TestPanelProps) => {
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      await onTest(paramValues);
    } catch (error) {
      console.error('Test failed:', error);
    }
    setIsLoading(false);
  };

  const handleSaveConfig = () => {
    if (!onSaveConfig) return;
    
    onSaveConfig({
      parameterValues: paramValues,
      savedAt: new Date().toISOString(),
      responseTime: testConfig?.responseTime,
      lastResponse: testConfig?.lastResponse,
    });

    toast({
      title: "Test configuration saved",
      description: "Your test settings have been saved for future use.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test API Action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Endpoint URL</h3>
          <p className="text-sm font-mono bg-muted p-2 rounded">
            {form.getValues('endpoint')}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Method</h3>
          <Badge variant="outline">{form.getValues('method')}</Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Headers</h3>
          <pre className="text-sm font-mono bg-muted p-2 rounded overflow-x-auto">
            {form.getValues('headers')}
          </pre>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Test Parameters</h3>
          <div className="grid gap-4">
            {parameters.map((param) => (
              <TestParameterInput
                key={param.id}
                parameter={param}
                value={paramValues[param.name]}
                onChange={(value) => setParamValues(prev => ({
                  ...prev,
                  [param.name]: value
                }))}
              />
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleTest}
            variant={isTestSuccessful ? "default" : "secondary"}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Test API Action'}
          </Button>
          
          {onSaveConfig && (
            <Button
              onClick={handleSaveConfig}
              variant="outline"
              size="icon"
              title="Save test configuration"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isTestSuccessful && (
          <div className="text-sm text-green-600">
            API test was successful. You can now enable this action.
          </div>
        )}

        <ResponseDetails testConfig={testConfig} />
      </CardContent>
    </Card>
  );
};
