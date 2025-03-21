
export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive';
  type: 'visitor' | 'customer';
  title?: string;
  department?: string;
  timezone?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  language?: string;
  source?: 'website' | 'referral' | 'marketing' | 'sales' | 'other';
  assignedTo?: string;
  accountValue?: number;
  tags: string[];
  notes?: string;
  lastContacted?: string;
  createdAt: string;
  updatedAt: string;
  // Address fields
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Communication preferences
  emailOptIn?: boolean;
  smsOptIn?: boolean;
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    phone: boolean;
    mail: boolean;
  };
  // Activity tracking
  totalOrders?: number;
  totalSpent?: number;
  lastActivity?: string;
  visitCount?: number;
  leadScore?: number;
  // Add index signature for custom fields
  [key: string]: string | number | string[] | undefined | boolean | object;
}
