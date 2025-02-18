
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ActionTestPanelProps } from './parameter/types';

export const ActionTestPanel = ({ form, isTestSuccessful, onTest }: ActionTestPanelProps) => {
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
        <Button 
          onClick={onTest}
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
  );
};
