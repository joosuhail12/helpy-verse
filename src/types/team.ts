
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface TeamOfficeHours {
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface TeamChannel {
  id: string;
  name: string;
  type: 'email' | 'chat';
}

export interface TeamRouting {
  type: 'manual' | 'round-robin' | 'load-balanced';
  limits?: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
}

export interface Team {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'inactive';
  type: 'support' | 'sales' | 'product' | 'other';
  memberCount: number;
  members: {
    id: string;
    name: string;
    email: string;
  }[];
  officeHours: TeamOfficeHours;
  channels: TeamChannel[];
  routing: TeamRouting[];
  holidays: string[];
}

// Props interfaces for team components
export interface TeamChannelSelectorProps {
  selectedChatChannel?: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId?: string) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

export interface TeamHolidaySelectorProps {
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}

export interface TeamIconPickerProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
}

export interface TeamMembersSelectorProps {
  teammates: any[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

export interface TeamOfficeHoursSelectorProps {
  officeHours: { [key in DayOfWeek]: TimeSlot[] };
  onOfficeHoursChange: (hours: { [key in DayOfWeek]: TimeSlot[] }) => void;
}

export interface TeamRoutingSelectorProps {
  routingType: 'manual' | 'round-robin' | 'load-balanced';
  setRoutingType: (type: 'manual' | 'round-robin' | 'load-balanced') => void;
  routingLimits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  setRoutingLimits: (limits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => void;
}
