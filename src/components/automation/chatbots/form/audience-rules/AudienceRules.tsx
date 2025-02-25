
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QueryBuilder } from '@/components/common/query-builder/QueryBuilder';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { QueryGroup } from '@/types/queryBuilder';
import { useAudienceFields } from './hooks/useAudienceFields';

interface AudienceRulesProps {
  onNextStep: () => void;
}

export const AudienceRules = ({ onNextStep }: AudienceRulesProps) => {
  const [queryGroup, setQueryGroup] = useState<QueryGroup>({
    id: '1',
    combinator: 'and',
    rules: []
  });

  const fields = useAudienceFields();

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
      <CardHeader className="space-y-2 pb-6">
        <h2 className="text-xl font-semibold">Audience Rules</h2>
        <p className="text-muted-foreground">
          Define who can interact with your chatbot by creating targeting rules. First select a data source,
          then choose the field, operator, and value for your condition.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <QueryBuilder
          value={queryGroup}
          onChange={setQueryGroup}
          fields={fields}
        />
        
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="submit"
            onClick={onNextStep}
          >
            Continue to Knowledge Base
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
