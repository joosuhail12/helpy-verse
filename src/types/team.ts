
export interface Team {
  id: string;
  name: string;
  icon?: string;
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

export interface TeamCreatePayload {
  name: string;
  icon: string;
  members: string[];
}

export interface TeamIconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export interface TeamMembersSelectorProps {
  teammates: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}
