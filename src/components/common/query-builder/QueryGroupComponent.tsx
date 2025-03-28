
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Copy } from 'lucide-react';
import type { QueryGroup, QueryRule, QueryField } from '@/types/queryBuilder';
import { QueryRule as QueryRuleComponent } from './QueryRule';
import { generateId } from '@/lib/utils';
import type { ValidationError } from '@/components/automation/chatbots/form/audience-rules/utils/validation';
import { toast } from '@/hooks/use-toast';
import { useCallback } from 'react';

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

  const handleDuplicateRule = (index: number) => {
    const ruleToDuplicate = group.rules[index];
    const duplicatedRule = {
      ...JSON.parse(JSON.stringify(ruleToDuplicate)),
      id: generateId(),
    };
    
    const newRules = [...group.rules];
    newRules.splice(index + 1, 0, duplicatedRule);
    onChange({ ...group, rules: newRules });
    
    toast({
      description: "Rule duplicated successfully",
    });
  };

  const copyRuleToClipboard = useCallback((rule: QueryRule | QueryGroup) => {
    try {
      const ruleString = JSON.stringify(rule);
      navigator.clipboard.writeText(ruleString);
      toast({
        description: "Rule copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to copy rule",
      });
    }
  }, []);

  const handlePasteRule = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const pastedRule = JSON.parse(clipboardText);
      
      // Validate the pasted content has the required structure
      if (!('id' in pastedRule)) {
        throw new Error('Invalid rule format');
      }

      // Generate new ID for the pasted rule
      const newRule = {
        ...pastedRule,
        id: generateId(),
      };

      onChange({
        ...group,
        rules: [...group.rules, newRule],
      });

      toast({
        description: "Rule pasted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Invalid rule format in clipboard",
      });
    }
  }, [group, onChange]);

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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePasteRule}
          >
            Paste Rule
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {group.rules.map((rule, index) => (
          <div key={rule.id} className="flex items-start gap-2">
            <div className="flex-1">
              {'field' in rule ? (
                <QueryRuleComponent
                  rule={rule}
                  onChange={(newRule) => handleRuleChange(index, newRule)}
                  fields={fields}
                  errors={errors}
                />
              ) : (
                <QueryGroupComponent
                  group={rule}
                  onChange={(newGroup) => handleRuleChange(index, newGroup)}
                  fields={fields}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  errors={errors}
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => copyRuleToClipboard(rule)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDuplicateRule(index)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveRule(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

