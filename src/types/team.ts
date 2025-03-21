
// Define Time Slot and Day of Week types
export type TimeSlot = {
  start: string;
  end: string;
};

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Define the base Team type
export interface Team {
  id: string;
  name: string;
  icon?: string;
  members?: number;
  teamMembers?: { id: string; name: string; email: string; role: string; status: string }[];
  createdAt: string;
  updatedAt: string;
  routingStrategy?: 'manual' | 'round-robin' | 'load-balanced';
  maxTotalTickets?: number;
  maxOpenTickets?: number;
  maxActiveChats?: number;
  officeHours?: { [key in DayOfWeek]: TimeSlot[] };
  holidays?: string[];
  channels?: {
    chat?: string;
    email?: string[];
  };
}

// For backward compatibility
export type TeamNew = Team;

// Define the TeamsState interface
export interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  areTeamsLoaded: boolean;
}

// Props for team-related components
export interface TeamIconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

export interface TeamMembersSelectorProps {
  teammates: any[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

export interface TeamChannelSelectorProps {
  selectedChatChannel?: string;
  selectedEmailChannels?: string[];
  onChatChannelSelect: (channelId: string) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

export interface TeamRoutingSelectorProps {
  selectedType: 'manual' | 'round-robin' | 'load-balanced';
  onTypeSelect: (type: 'manual' | 'round-robin' | 'load-balanced') => void;
  limits?: {
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  onLimitsChange?: (limits: {
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => void;
}

export interface TeamOfficeHoursSelectorProps {
  officeHours: { [key in DayOfWeek]: TimeSlot[] };
  onOfficeHoursChange: (officeHours: { [key in DayOfWeek]: TimeSlot[] }) => void;
}

export interface TeamHolidaySelectorProps {
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}
