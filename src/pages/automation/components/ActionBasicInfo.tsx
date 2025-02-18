
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CustomAction } from '@/types/action';

interface ActionBasicInfoProps {
  action: CustomAction;
}

const ActionBasicInfo = ({ action }: ActionBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Description</dt>
            <dd className="mt-1">{action.description}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Tool Name</dt>
            <dd className="mt-1">{action.toolName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
            <dd className="mt-1">{new Date(action.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default ActionBasicInfo;

