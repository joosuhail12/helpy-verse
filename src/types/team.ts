
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
  // Add missing properties
  teamMembers?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
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
  teamId?: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
}

// Add missing team types
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface TeamChannelSelectorProps {
  selectedChatChannel?: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId: string | undefined) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

export interface TeamHolidaySelectorProps {
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}

export interface TeamIconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
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

export interface TeamOfficeHoursSelectorProps {
  officeHours: { [key in DayOfWeek]: TimeSlot[] };
  onOfficeHoursChange: (hours: { [key in DayOfWeek]: TimeSlot[] }) => void;
}

export interface TeamRoutingSelectorProps {
  selectedType: 'manual' | 'round-robin' | 'load-balanced';
  onTypeSelect: (type: 'manual' | 'round-robin' | 'load-balanced') => void;
  limits: {
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  onLimitsChange: (limits: {
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => void;
}

export interface TeamsState {
  teams: Team[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentTeam: Team | null;
}
