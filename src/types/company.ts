
export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  type?: string;
  status?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  
  // Additional properties
  location?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  numberOfEmployees?: number;
  annualRevenue?: string;
  description?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}
