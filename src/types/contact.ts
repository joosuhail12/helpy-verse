
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
}
