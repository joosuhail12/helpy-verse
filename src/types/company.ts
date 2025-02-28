
export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  description?: string;
  location?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
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
  lastActivity?: string;
  tags?: string[] | { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string }[]; // Explicitly defined

}
