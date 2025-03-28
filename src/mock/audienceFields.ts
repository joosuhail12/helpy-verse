
import { QueryField, DataSource, FieldType } from '@/types/queryBuilder';

export const mockAudienceFields: QueryField[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    dataSource: 'contacts',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'text',
    dataSource: 'contacts',
  },
  {
    id: 'company',
    label: 'Company Name',
    type: 'text',
    dataSource: 'companies',
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    dataSource: 'contacts',
    options: ['Active', 'Inactive', 'Pending'],
  },
  {
    id: 'interests',
    label: 'Interests',
    type: 'multi-select',
    dataSource: 'contacts',
    options: ['Technology', 'Marketing', 'Sales', 'Support', 'Design'],
  },
  {
    id: 'is_verified',
    label: 'Is Verified',
    type: 'boolean',
    dataSource: 'contacts',
  },
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    dataSource: 'contacts',
  },
  {
    id: 'created_at',
    label: 'Created Date',
    type: 'date',
    dataSource: 'contacts',
  },
  {
    id: 'last_active',
    label: 'Last Active',
    type: 'date',
    dataSource: 'contacts',
  },
  {
    id: 'subscription_date',
    label: 'Subscription Date',
    type: 'date',
    dataSource: 'contacts',
  },
  {
    id: 'last_purchase',
    label: 'Last Purchase Date',
    type: 'date',
    dataSource: 'contacts',
  },
  {
    id: 'next_renewal',
    label: 'Next Renewal Date',
    type: 'date',
    dataSource: 'contacts',
  },
  {
    id: 'subscription_type',
    label: 'Subscription Type',
    type: 'select',
    dataSource: 'contacts',
    options: ['Basic', 'Premium', 'Enterprise'],
  },
  {
    id: 'tags',
    label: 'Tags',
    type: 'multi-select',
    dataSource: 'contacts',
    options: ['VIP', 'New', 'At Risk', 'Champion', 'Qualified'],
  },
];
