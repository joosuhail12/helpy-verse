
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: number;
  active: boolean;
  tags?: string[];
  color?: string;
  createdAt: string;
  lastUpdated?: string;
}

export interface TeamNew {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  active?: boolean;
  members?: number;
  workspaceId?: string;
  createdBy?: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
}
