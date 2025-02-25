
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QueryBuilder } from '@/components/common/query-builder/QueryBuilder';
import type { QueryField, QueryGroup } from '@/types/queryBuilder';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SAMPLE_FIELDS: QueryField[] = [
  // Contact fields
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
    options: ['visitor', 'customer', 'lead', 'prospect']
  },
  {
    id: 'tags',
    label: 'Tags',
    type: 'multi-select',
    source: 'contacts',
    options: ['VIP', 'Enterprise', 'SMB', 'Startup']
  },
  {
    id: 'lastLogin',
    label: 'Last Login Date',
    type: 'date',
    source: 'contacts'
  },
  {
    id: 'isActive',
    label: 'Is Active',
    type: 'boolean',
    source: 'contacts'
  },
  {
    id: 'score',
    label: 'Lead Score',
    type: 'number',
    source: 'contacts'
  },
  
  // Company fields
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
    options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other']
  },
  {
    id: 'employeeCount',
    label: 'Employee Count',
    type: 'number',
    source: 'companies'
  },
  {
    id: 'revenue',
    label: 'Annual Revenue',
    type: 'number',
    source: 'companies'
  },
  {
    id: 'locations',
    label: 'Office Locations',
    type: 'multi-select',
    source: 'companies',
    options: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania']
  },
  {
    id: 'founded',
    label: 'Founded Date',
    type: 'date',
    source: 'companies'
  },
  {
    id: 'isPublic',
    label: 'Is Publicly Traded',
    type: 'boolean',
    source: 'companies'
  },

  // Custom Object fields (for the Orders custom object)
  {
    id: 'orderNumber',
    label: 'Order Number',
    type: 'text',
    source: 'custom_objects',
    customObject: 'orders'
  },
  {
    id: 'orderTotal',
    label: 'Order Total',
    type: 'number',
    source: 'custom_objects',
    customObject: 'orders'
  },
  {
    id: 'orderStatus',
    label: 'Order Status',
    type: 'select',
    source: 'custom_objects',
    customObject: 'orders',
    options: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  {
    id: 'paymentMethods',
    label: 'Payment Methods',
    type: 'multi-select',
    source: 'custom_objects',
    customObject: 'orders',
    options: ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto']
  },
  {
    id: 'orderDate',
    label: 'Order Date',
    type: 'date',
    source: 'custom_objects',
    customObject: 'orders'
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
    onNextStep();
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

