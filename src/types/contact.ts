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
  tags?: { id: string; name: string }[]; // Explicitly defined
  notes?: string;
  lastContacted?: string;
  createdAt?: string;
  updatedAt?: string;
  // Address fields
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // Adjusted index signature to exclude complex object types
  [key: string]: string | number | boolean | string[] | undefined | { id: string; name: string }[] | unknown;
}
