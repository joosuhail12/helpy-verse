
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { QueryRule } from './QueryRule';
import type { QueryGroup, QueryRule as QueryRuleType, QueryField } from '@/types/queryBuilder';
import { generateId } from '@/lib/utils';

interface QueryGroupComponentProps {
  group: QueryGroup;
  onChange: (group: QueryGroup) => void;
  onDelete?: () => void;
  fields: QueryField[];
  depth: number;
  maxDepth: number;
}

export const QueryGroupComponent = ({
  group,
  onChange,
  onDelete,
  fields,
  depth,
  maxDepth
}: QueryGroupComponentProps) => {
  const handleCombinatorChange = (value: string) => {
    onChange({
      ...group,
      combinator: value as 'and' | 'or'
    });
  };

  const handleRuleChange = (index: number, rule: QueryRuleType | QueryGroup) => {
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
          value: ''
        }
      ]
    });
  };

  const handleDelete = (index: number) => {
    onChange({
      ...group,
      rules: group.rules.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white/50">
      <div className="flex items-center gap-2">
        <Select
          value={group.combinator}
          onValueChange={handleCombinatorChange}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="and">AND</SelectItem>
            <SelectItem value="or">OR</SelectItem>
          </SelectContent>
        </Select>

        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {group.rules.map((rule, index) => (
          'combinator' in rule ? (
            <QueryGroupComponent
              key={rule.id}
              group={rule}
              onChange={(newGroup) => handleRuleChange(index, newGroup)}
              onDelete={() => handleDelete(index)}
              fields={fields}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ) : (
            <QueryRule
              key={rule.id}
              rule={rule}
              onChange={(newRule) => handleRuleChange(index, newRule)}
              onDelete={() => handleDelete(index)}
              fields={fields}
            />
          )
        ))}
      </div>

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
            onClick={() => {
              onChange({
                ...group,
                rules: [
                  ...group.rules,
                  {
                    id: generateId(),
                    combinator: 'and',
                    rules: []
                  }
                ]
              });
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Group
          </Button>
        )}
      </div>
    </div>
  );
};
