
export interface Team {
  id: string;
  name: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}
