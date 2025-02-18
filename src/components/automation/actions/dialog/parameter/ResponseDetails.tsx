
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TestConfig } from './types/testConfig';

interface ResponseDetailsProps {
  testConfig?: TestConfig;
}

export const ResponseDetails = ({ testConfig }: ResponseDetailsProps) => {
  if (!testConfig?.lastResponse) return null;

  const { status, data, headers } = testConfig.lastResponse;
  const isSuccess = status >= 200 && status < 300;

  return (
    <Card className="p-4 mt-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={isSuccess ? "default" : "destructive"}>
              Status: {status}
            </Badge>
            {testConfig.responseTime && (
              <Badge variant="outline">
                Response Time: {testConfig.responseTime}ms
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Response Headers</h4>
          <ScrollArea className="h-[100px] rounded-md border p-2">
            <pre className="text-xs">
              {JSON.stringify(headers, null, 2)}
            </pre>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Response Data</h4>
          <ScrollArea className="h-[200px] rounded-md border p-2">
            <pre className="text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};
