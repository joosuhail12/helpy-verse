
import React from 'react';
import { QueryGroup } from '@/types/queryBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleIcon, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AudienceSizeEstimatorProps {
  matchCount: number;
  queryGroup: QueryGroup;
}

const AudienceSizeEstimator: React.FC<AudienceSizeEstimatorProps> = ({ matchCount, queryGroup }) => {
  // Check if there are any rules defined
  const hasRules = queryGroup.rules.length > 0;
  
  // Size category based on match count
  const getSizeCategory = () => {
    if (matchCount === 0) return { label: 'No matches', color: 'text-gray-400' };
    if (matchCount < 10) return { label: 'Very Small', color: 'text-blue-400' };
    if (matchCount < 100) return { label: 'Small', color: 'text-green-400' };
    if (matchCount < 1000) return { label: 'Medium', color: 'text-yellow-400' };
    if (matchCount < 10000) return { label: 'Large', color: 'text-orange-400' };
    return { label: 'Very Large', color: 'text-red-400' };
  };
  
  const sizeCategory = getSizeCategory();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Audience Size</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This is an estimate of how many users or contacts will match your audience criteria.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Estimated number of matching users
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasRules ? (
          <div className="text-muted-foreground text-sm">
            Add rules to see estimated audience size
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center">
              <CircleIcon className={`h-3 w-3 mr-2 ${sizeCategory.color}`} />
              <span className="font-medium">{sizeCategory.label}</span>
            </div>
            <div className="text-2xl font-bold">
              {matchCount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {matchCount === 0 
                ? 'No users match the current criteria' 
                : 'Users matching all conditions'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudienceSizeEstimator;
