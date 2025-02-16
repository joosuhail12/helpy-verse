
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
  foundedYear?: number;
  mainContact?: string;
  tierLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastContactDate?: string;
  marketSegment?: string;
  businessModel?: 'b2b' | 'b2c' | 'b2b2c';
  preferredLanguage?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

