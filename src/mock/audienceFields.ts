
import { QueryField } from '@/types/queryBuilder';

// Sample audience fields for chatbot audience targeting
export const audienceFields: QueryField[] = [
  {
    id: 'firstname',
    name: 'firstname',
    label: 'First Name',
    type: 'text',
    dataSource: 'contacts'
  },
  {
    id: 'lastname',
    name: 'lastname',
    label: 'Last Name',
    type: 'text',
    dataSource: 'contacts'
  },
  {
    id: 'email',
    name: 'email',
    label: 'Email',
    type: 'text',
    dataSource: 'contacts'
  },
  {
    id: 'phone',
    name: 'phone',
    label: 'Phone Number',
    type: 'text',
    dataSource: 'contacts'
  },
  {
    id: 'customer_type',
    name: 'customer_type',
    label: 'Customer Type',
    type: 'select',
    dataSource: 'contacts',
    options: [
      { label: 'Lead', value: 'lead' },
      { label: 'Customer', value: 'customer' },
      { label: 'Partner', value: 'partner' }
    ]
  },
  {
    id: 'subscription_status',
    name: 'subscription_status',
    label: 'Subscription Status',
    type: 'select',
    dataSource: 'contacts',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Trial', value: 'trial' },
      { label: 'Expired', value: 'expired' },
      { label: 'Cancelled', value: 'cancelled' }
    ]
  },
  {
    id: 'last_active',
    name: 'last_active',
    label: 'Last Active',
    type: 'date',
    dataSource: 'contacts'
  },
  {
    id: 'company_name',
    name: 'company_name',
    label: 'Company Name',
    type: 'text',
    dataSource: 'companies'
  },
  {
    id: 'company_size',
    name: 'company_size',
    label: 'Company Size',
    type: 'select',
    dataSource: 'companies',
    options: [
      { label: '1-10', value: 'small' },
      { label: '11-50', value: 'medium' },
      { label: '51-200', value: 'large' },
      { label: '201+', value: 'enterprise' }
    ]
  },
  {
    id: 'industry',
    name: 'industry',
    label: 'Industry',
    type: 'select',
    dataSource: 'companies',
    options: [
      { label: 'Technology', value: 'technology' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Finance', value: 'finance' },
      { label: 'Education', value: 'education' },
      { label: 'Retail', value: 'retail' }
    ]
  },
  {
    id: 'location',
    name: 'location',
    label: 'Location',
    type: 'text',
    dataSource: 'companies'
  },
  {
    id: 'is_enterprise',
    name: 'is_enterprise',
    label: 'Enterprise Customer',
    type: 'boolean',
    dataSource: 'companies'
  },
  {
    id: 'tags',
    name: 'tags',
    label: 'Tags',
    type: 'multi-select',
    dataSource: 'general',
    options: [
      { label: 'VIP', value: 'vip' },
      { label: 'New', value: 'new' },
      { label: 'Returning', value: 'returning' },
      { label: 'High Value', value: 'high_value' }
    ]
  }
];
