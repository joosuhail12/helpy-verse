
export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
  description?: string;
  location?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  phone?: string;
  email?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  type?: 'customer' | 'partner' | 'prospect' | 'vendor';
  status?: 'active' | 'inactive';
  accountOwner?: string;
  createdAt: string;
  updatedAt: string;
}
