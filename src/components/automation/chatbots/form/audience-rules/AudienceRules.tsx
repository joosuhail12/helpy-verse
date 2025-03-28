
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QueryBuilder } from '@/components/common/query-builder/QueryBuilder';
import { useRuleBuilder } from './hooks/useRuleBuilder';
import { useAudienceFields } from './hooks/useAudienceFields';
import AudienceSizeEstimator from './components/AudienceSizeEstimator';
import SampleMatchesPreview from './components/SampleMatchesPreview';
import { RuleValidationSummary } from './components/RuleValidationSummary';
import { ValidationError } from '@/types/queryBuilder';

export const AudienceRules = () => {
  const [isValid, setIsValid] = useState(true);
  const fields = useAudienceFields();
  const {
    queryGroup,
    updateQueryGroup,
    addRule,
    addGroup,
    validate,
    errors
  } = useRuleBuilder();

  useEffect(() => {
    const isValid = validate();
    setIsValid(isValid);
  }, [queryGroup, validate]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <QueryBuilder
            value={queryGroup}
            onChange={updateQueryGroup}
            fields={fields}
            errors={errors as ValidationError[]}
          />
          {!isValid && errors.length > 0 && (
            <div className="mt-4">
              <RuleValidationSummary errors={errors as ValidationError[]} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AudienceSizeEstimator queryGroup={queryGroup} />
        <SampleMatchesPreview queryGroup={queryGroup} />
      </div>
    </div>
  );
};
