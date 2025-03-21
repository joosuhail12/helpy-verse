
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QueryBuilder } from '@/components/common/query-builder/QueryBuilder';
import { Button } from '@/components/ui/button';
import { QueryGroup } from '@/types/queryBuilder';
import { useAudienceFields } from './hooks/useAudienceFields';
import { useRuleBuilder } from './hooks/useRuleBuilder';
import { RulePreview } from './components/RulePreview';

interface AudienceRulesProps {
  onNextStep: () => void;
}

export const AudienceRules = ({ onNextStep }: AudienceRulesProps) => {
  const fields = useAudienceFields();
  const initialGroup: QueryGroup = {
    id: '1',
    combinator: 'and',
    rules: [],
  };

  const { queryGroup, errors, handleRuleChange, validateRules } = useRuleBuilder(initialGroup, fields);

  const handleSubmit = () => {
    if (validateRules()) {
      onNextStep();
    }
  };

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
          onChange={handleRuleChange}
          fields={fields}
          errors={errors}
        />
        
        <RulePreview group={queryGroup} fields={fields} />
        
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            onClick={handleSubmit}
          >
            Continue to Knowledge Base
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
