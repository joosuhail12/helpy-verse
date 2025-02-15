
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
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
  preferredLanguage?: string;
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
  // Add index signature for custom fields
  [key: string]: string | number | string[] | undefined | boolean;
}

