
export interface Teammate {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent' | 'viewer';
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
  avatar?: string;
}

export interface NewTeammate {
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent' | 'viewer';
}

