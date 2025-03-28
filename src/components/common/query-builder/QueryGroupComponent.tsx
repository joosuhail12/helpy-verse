
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { QueryRule } from './QueryRule';
import { generateId } from '@/lib/utils';

// Simplified interfaces
interface QueryRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<QueryRule | QueryGroup>;
}

interface QueryField {
  id: string;
  label: string;
  type: string;
  name: string;
  options?: string[];
}

interface ValidationError {
  message: string;
  path?: string;
  field?: string;
  rule?: { id: string };
  group?: QueryGroup;
}

interface QueryGroupComponentProps {
  group: QueryGroup;
  onChange: (group: QueryGroup) => void;
  fields: QueryField[];
  depth: number;
  maxDepth: number;
  errors?: ValidationError[];
}

export const QueryGroupComponent = ({
  group,
  onChange,
  fields,
  depth,
  maxDepth,
  errors = [],
}: QueryGroupComponentProps) => {
  const handleCombinatorChange = (value: string) => {
    onChange({
      ...group,
      combinator: value as 'and' | 'or',
    });
  };

  const handleRuleChange = (index: number, rule: QueryRule | QueryGroup) => {
    const newRules = [...group.rules];
    newRules[index] = rule;
    onChange({ ...group, rules: newRules });
  };

  const handleAddRule = () => {
    onChange({
      ...group,
      rules: [
        ...group.rules,
        {
          id: generateId(),
          field: '',
          operator: 'equals',
          value: '',
        },
      ],
    });
  };

  const handleAddGroup = () => {
    if (depth < maxDepth) {
      onChange({
        ...group,
        rules: [
          ...group.rules,
          {
            id: generateId(),
            combinator: 'and',
            rules: [],
          },
        ],
      });
    }
  };

  const handleRemoveRule = (index: number) => {
    const newRules = group.rules.filter((_, i) => i !== index);
    onChange({ ...group, rules: newRules });
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2">
        <Select value={group.combinator} onValueChange={handleCombinatorChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="and">AND</SelectItem>
            <SelectItem value="or">OR</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRule}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
          {depth < maxDepth && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddGroup}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {group.rules.map((rule, index) => (
          <div key={'field' in rule ? rule.id : rule.id} className="flex items-start gap-2">
            <div className="flex-1">
              {'field' in rule ? (
                <QueryRule
                  rule={rule as QueryRule}
                  onChange={(newRule) => handleRuleChange(index, newRule)}
                  fields={fields}
                  errors={errors}
                />
              ) : (
                <QueryGroupComponent
                  group={rule as QueryGroup}
                  onChange={(newGroup) => handleRuleChange(index, newGroup)}
                  fields={fields}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  errors={errors}
                />
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveRule(index)}
                title="Delete"
                className="text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
