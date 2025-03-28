
import React from 'react';
import { QueryGroup } from '@/types/queryBuilder';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SampleMatchesPreviewProps {
  queryGroup: QueryGroup;
}

const SampleMatchesPreview: React.FC<SampleMatchesPreviewProps> = ({ queryGroup }) => {
  // Check if there are any rules defined
  const hasRules = queryGroup.rules.length > 0;
  
  // In a real application, this would fetch matches based on the query rules
  // For now, we'll just display a loading or empty state
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Sample Matches</CardTitle>
        <CardDescription>
          These entries match your audience criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasRules ? (
          <div className="text-muted-foreground text-sm">
            Add rules to see matching records
          </div>
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SampleMatchesPreview;
