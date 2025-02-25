
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QueryBuilder } from '@/components/common/query-builder/QueryBuilder';
import type { QueryField, QueryGroup } from '@/types/queryBuilder';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SAMPLE_FIELDS: QueryField[] = [
  {
    id: 'firstName',
    label: 'First Name',
    type: 'text',
    source: 'contacts'
  },
  {
    id: 'lastName',
    label: 'Last Name',
    type: 'text',
    source: 'contacts'
  },
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    source: 'contacts'
  },
  {
    id: 'type',
    label: 'Customer Type',
    type: 'select',
    source: 'contacts',
    options: ['visitor', 'customer']
  },
  {
    id: 'companyName',
    label: 'Company Name',
    type: 'text',
    source: 'companies'
  },
  {
    id: 'industry',
    label: 'Industry',
    type: 'select',
    source: 'companies',
    options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Other']
  }
];

interface AudienceRulesProps {
  onNextStep: () => void;
}

export const AudienceRules = ({ onNextStep }: AudienceRulesProps) => {
  const [queryGroup, setQueryGroup] = useState<QueryGroup>({
    id: '1',
    combinator: 'and',
    rules: []
  });

  const handleSubmit = () => {
    // Here you would typically save the query group to your state management
    // For now, we'll just move to the next step
    onNextStep();
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
      <CardHeader className="space-y-2 pb-6">
        <h2 className="text-xl font-semibold">Audience Rules</h2>
        <p className="text-muted-foreground">
          Define who can interact with your chatbot by creating targeting rules
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <QueryBuilder
          value={queryGroup}
          onChange={setQueryGroup}
          fields={SAMPLE_FIELDS}
        />
        
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="submit"
            onClick={handleSubmit}
          >
            Continue to Knowledge Base
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
