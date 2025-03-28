
export interface ContactFilters {
  search: string;
  status: string[];
  type: string[];
  tags: string[];
}

export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  type?: string;
  tags?: string[];
  lastActivity?: string;
  lastContacted?: string;
  createdAt: string;
  updatedAt: string;
  
  notes?: string;
  title?: string;
  department?: string;
  timezone?: string;
  source?: string;
  language?: string;
  preferredLanguage?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  
  // More structured data
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  
  // Adding an index signature for dynamic custom fields
  [key: string]: any;
}
