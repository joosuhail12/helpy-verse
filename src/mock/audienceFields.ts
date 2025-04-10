
import { QueryField } from '@/types/queryBuilder';

export const mockAudienceFields: QueryField[] = [
  {
    id: 'name',
    name: 'Name',
    label: 'Name',
    type: 'text',
    source: 'contacts',
  },
  {
    id: 'email',
    name: 'Email',
    label: 'Email',
    type: 'text',
    source: 'contacts',
  },
  {
    id: 'company',
    name: 'Company Name',
    label: 'Company Name',
    type: 'text',
    source: 'companies',
  },
  {
    id: 'status',
    name: 'Status',
    label: 'Status',
    type: 'select',
    source: 'contacts',
    options: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
      { label: 'Pending', value: 'Pending' }
    ],
  },
  {
    id: 'interests',
    name: 'Interests',
    label: 'Interests',
    type: 'multi-select',
    source: 'contacts',
    options: [
      { label: 'Technology', value: 'Technology' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
      { label: 'Support', value: 'Support' },
      { label: 'Design', value: 'Design' }
    ],
  },
  {
    id: 'is_verified',
    name: 'Is Verified',
    label: 'Is Verified',
    type: 'boolean',
    source: 'contacts',
  },
  {
    id: 'age',
    name: 'Age',
    label: 'Age',
    type: 'number',
    source: 'contacts',
  },
  {
    id: 'created_at',
    name: 'Created Date',
    label: 'Created Date',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'last_active',
    name: 'Last Active',
    label: 'Last Active',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'subscription_date',
    name: 'Subscription Date',
    label: 'Subscription Date',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'last_purchase',
    name: 'Last Purchase Date',
    label: 'Last Purchase Date',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'next_renewal',
    name: 'Next Renewal Date',
    label: 'Next Renewal Date',
    type: 'date',
    source: 'contacts',
  },
  {
    id: 'subscription_type',
    name: 'Subscription Type',
    label: 'Subscription Type',
    type: 'select',
    source: 'contacts',
    options: [
      { label: 'Basic', value: 'Basic' },
      { label: 'Premium', value: 'Premium' },
      { label: 'Enterprise', value: 'Enterprise' }
    ],
  },
  {
    id: 'tags',
    name: 'Tags',
    label: 'Tags',
    type: 'multi-select',
    source: 'contacts',
    options: [
      { label: 'VIP', value: 'VIP' },
      { label: 'New', value: 'New' },
      { label: 'At Risk', value: 'At Risk' },
      { label: 'Champion', value: 'Champion' },
      { label: 'Qualified', value: 'Qualified' }
    ],
  },
];
