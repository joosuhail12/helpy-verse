
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QueryBuilder } from '@/components/common/query-builder/QueryBuilder';
import type { QueryField, QueryGroup } from '@/types/queryBuilder';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { mapFieldType } from '@/components/common/query-builder/utils/fieldTypeMapping';

const SAMPLE_FIELDS: QueryField[] = [
  // Contact fields
  {
    id: 'firstName',
    label: 'First Name',
    type: mapFieldType('text'),
    source: 'contacts'
  },
  {
    id: 'lastName',
    label: 'Last Name',
    type: mapFieldType('text'),
    source: 'contacts'
  },
  {
    id: 'email',
    label: 'Email',
    type: mapFieldType('text'),
    source: 'contacts'
  },
  {
    id: 'description',
    label: 'Description',
    type: mapFieldType('rich-text'),
    source: 'contacts'
  },
  {
    id: 'website',
    label: 'Website',
    type: mapFieldType('url'),
    source: 'contacts'
  },
  {
    id: 'type',
    label: 'Customer Type',
    type: mapFieldType('select'),
    source: 'contacts',
    options: ['visitor', 'customer', 'lead', 'prospect']
  },
  {
    id: 'tags',
    label: 'Tags',
    type: mapFieldType('multi-select'),
    source: 'contacts',
    options: ['VIP', 'Enterprise', 'SMB', 'Startup']
  },
  {
    id: 'lastLogin',
    label: 'Last Login Date',
    type: mapFieldType('date'),
    source: 'contacts'
  },
  {
    id: 'createdAt',
    label: 'Created Date',
    type: mapFieldType('datetime'),
    source: 'contacts'
  },
  {
    id: 'isActive',
    label: 'Is Active',
    type: mapFieldType('boolean'),
    source: 'contacts'
  },
  {
    id: 'score',
    label: 'Lead Score',
    type: mapFieldType('number'),
    source: 'contacts'
  },
  {
    id: 'budget',
    label: 'Budget',
    type: mapFieldType('currency'),
    source: 'contacts'
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: mapFieldType('tel'),
    source: 'contacts'
  },
  
  // Company fields
  {
    id: 'companyName',
    label: 'Company Name',
    type: mapFieldType('text'),
    source: 'companies'
  },
  {
    id: 'companyDescription',
    label: 'Company Description',
    type: mapFieldType('rich-text'),
    source: 'companies'
  },
  {
    id: 'industry',
    label: 'Industry',
    type: mapFieldType('select'),
    source: 'companies',
    options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other']
  },
  {
    id: 'employeeCount',
    label: 'Employee Count',
    type: mapFieldType('number'),
    source: 'companies'
  },
  {
    id: 'revenue',
    label: 'Annual Revenue',
    type: mapFieldType('currency'),
    source: 'companies'
  },
  {
    id: 'locations',
    label: 'Office Locations',
    type: mapFieldType('multi-select'),
    source: 'companies',
    options: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania']
  },
  {
    id: 'founded',
    label: 'Founded Date',
    type: mapFieldType('date'),
    source: 'companies'
  },
  {
    id: 'website',
    label: 'Website',
    type: mapFieldType('url'),
    source: 'companies'
  },
  {
    id: 'isPublic',
    label: 'Is Publicly Traded',
    type: mapFieldType('boolean'),
    source: 'companies'
  },

  // Custom Object fields (for the Orders custom object)
  {
    id: 'orderNumber',
    label: 'Order Number',
    type: mapFieldType('text'),
    source: 'custom_objects',
    customObject: 'orders'
  },
  {
    id: 'orderDescription',
    label: 'Order Description',
    type: mapFieldType('rich-text'),
    source: 'custom_objects',
    customObject: 'orders'
  },
  {
    id: 'orderTotal',
    label: 'Order Total',
    type: mapFieldType('currency'),
    source: 'custom_objects',
    customObject: 'orders'
  },
  {
    id: 'orderStatus',
    label: 'Order Status',
    type: mapFieldType('select'),
    source: 'custom_objects',
    customObject: 'orders',
    options: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
  {
    id: 'paymentMethods',
    label: 'Payment Methods',
    type: mapFieldType('multi-select'),
    source: 'custom_objects',
    customObject: 'orders',
    options: ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto']
  },
  {
    id: 'orderDate',
    label: 'Order Date',
    type: mapFieldType('datetime'),
    source: 'custom_objects',
    customObject: 'orders'
  },
  {
    id: 'isUrgent',
    label: 'Is Urgent',
    type: mapFieldType('boolean'),
    source: 'custom_objects',
    customObject: 'orders'
  },
  {
    id: 'deliveryInstructions',
    label: 'Delivery Instructions',
    type: mapFieldType('rich-text'),
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
