
export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  type: string;
  status: string;
  company?: {
    id: string;
    name: string;
  };
  tags?: string[];
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}
