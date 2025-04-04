
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type QueryGroup } from '@/types/queryBuilder';

interface AudienceSizeEstimatorProps {
  queryGroup: QueryGroup;
}

const AudienceSizeEstimator: React.FC<AudienceSizeEstimatorProps> = ({ queryGroup }) => {
  // Check if there are any rules defined
  const hasRules = queryGroup.rules.length > 0;
  
  // Simulate fetching of audience size - in a real app this would calculate
  // based on the current queryGroup rules
  const audienceSize = hasRules ? Math.floor(Math.random() * 500) + 50 : 0;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Estimated Audience Size</CardTitle>
        <CardDescription>
          Approximate number of contacts matching your criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasRules ? (
          <div className="text-muted-foreground text-sm">
            Add rules to see audience size
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{audienceSize}</span>
            <span className="text-sm text-muted-foreground">contacts</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudienceSizeEstimator;
