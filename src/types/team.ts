export interface Team {
  id: string;
  name: string;
  icon?: string;
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  members?: string[],
  channels?: {
    chat?: string;
    email: string[];
  };
  routingStrategy: 'manual' | 'round-robin' | 'load-balanced';
  maxTotalTickets?: number;
  maxOpenTickets?: number;
  maxActiveChats?: number;
  officeHours: {
    [key in DayOfWeek]: TimeSlot[];
  };
  holidays: string[]; // Array of ISO date strings
  createdAt: string;
  updatedAt: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string; // 24h format HH:mm
  end: string; // 24h format HH:mm
}

export interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  teamDetails: Team | null
}

export interface TeamCreatePayload {
  name: string;
  icon: string;
  members: string[];
  channels?: {
    chat?: string;
    email: string[];
  };
  routing: {
    type: 'manual' | 'round-robin' | 'load-balanced';
    limits?: {
      maxTotalTickets?: number;
      maxOpenTickets?: number;
      maxActiveChats?: number;
    };
  };
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

export interface TeamChannelSelectorProps {
  selectedChatChannel?: string;
  selectedEmailChannels: string[] | null;
  onChatChannelSelect: (channelId: string | undefined) => void;
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

export interface TeamHolidaySelectorProps {
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}

export interface TeamOfficeHoursSelectorProps {
  officeHours: {
    [key in DayOfWeek]: TimeSlot[];
  };
  onOfficeHoursChange: (officeHours: { [key in DayOfWeek]: TimeSlot[] }) => void;
}
