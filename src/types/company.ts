
export interface CompanyLocation {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  size?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'lead';
  owner?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  location?: CompanyLocation;
  notes?: { id: string; content: string; createdAt: string; createdBy: string }[];
  customFields?: Record<string, any>;
  contacts?: string[] | { id: string, name: string }[];
  deals?: string[] | { id: string, name: string, value: number }[];
  annualRevenue?: number;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  lastActivity?: string;
}

export interface CompanyContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  avatarUrl?: string;
}
