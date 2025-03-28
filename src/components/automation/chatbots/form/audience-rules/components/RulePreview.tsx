
import React from 'react';
import { QueryGroup, QueryField } from '@/types/queryBuilder';
import { RulesSummary } from '@/components/common/query-builder/components/RulesSummary';
import AudienceSizeEstimator from './AudienceSizeEstimator';
import SampleMatchesPreview from './SampleMatchesPreview';
import { RuleConflictDetector } from './RuleConflictDetector';
import { DataConstraintValidator } from './DataConstraintValidator';

interface RulePreviewProps {
  group: QueryGroup;
  fields: QueryField[];
}

export const RulePreview: React.FC<RulePreviewProps> = ({ group, fields }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Rule Preview and Validation</h3>
      
      <RulesSummary group={group} fields={fields} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AudienceSizeEstimator queryGroup={group} />
        <DataConstraintValidator queryGroup={group} />
      </div>
      
      <RuleConflictDetector queryGroup={group} />
      
      <SampleMatchesPreview queryGroup={group} />
    </div>
  );
};
