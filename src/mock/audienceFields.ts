
import { QueryField, DataSource, FieldType } from '@/types/queryBuilder';

export const mockAudienceFields: QueryField[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    source: 'contacts',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    source: 'contacts',
  },
  {
    id: 'company',
    label: 'Company Name',
    type: 'text',
    source: 'companies',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    source: 'contacts',
    options: ['Active', 'Inactive', 'Pending'],
  },
  {
    id: 'created_at',
    label: 'Created Date',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'last_active',
    label: 'Last Active',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'subscription_date',
    label: 'Subscription Date',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'last_purchase',
    label: 'Last Purchase Date',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'next_renewal',
    label: 'Next Renewal Date',
    type: 'date',
    source: 'contacts',
  },
];

