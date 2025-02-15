
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive';
  tags: string[];
  lastContacted?: string;
  createdAt: string;
  updatedAt: string;
  type: 'visitor' | 'customer';
}
