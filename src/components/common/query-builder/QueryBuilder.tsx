
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { QueryGroup, QueryRule, QueryField } from '@/types/queryBuilder';
import { QueryGroupComponent } from './QueryGroupComponent';
import { generateId } from '@/lib/utils';

interface QueryBuilderProps {
  value: QueryGroup;
  onChange: (group: QueryGroup) => void;
  fields: QueryField[];
  maxDepth?: number;
}

export const QueryBuilder = ({ 
  value, 
  onChange, 
  fields, 
  maxDepth = 3 
}: QueryBuilderProps) => {
  const handleGroupChange = (group: QueryGroup) => {
    onChange(group);
  };

  const handleAddGroup = () => {
    onChange({
      ...value,
      rules: [
        ...value.rules,
        {
          id: generateId(),
          combinator: 'and',
          rules: []
        }
      ]
    });
  };

  return (
    <div className="space-y-4">
      <QueryGroupComponent
        group={value}
        onChange={handleGroupChange}
        fields={fields}
        depth={0}
        maxDepth={maxDepth}
      />
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAddGroup}
        className="mt-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Group
      </Button>
    </div>
  );
};
