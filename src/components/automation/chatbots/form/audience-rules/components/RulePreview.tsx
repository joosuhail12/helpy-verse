
import { Card } from '@/components/ui/card';
import { QueryGroup, QueryField } from '@/types/queryBuilder';
import { RulesSummary } from '@/components/common/query-builder/components/RulesSummary';

interface RulePreviewProps {
  group: QueryGroup;
  fields: QueryField[];
}

export const RulePreview = ({ group, fields }: RulePreviewProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm p-4">
      <RulesSummary group={group} fields={fields} />
    </Card>
  );
};
