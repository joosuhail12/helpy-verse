
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface TeamOfficeHours {
  days: string[];
  startTime: string;
  endTime: string;
  timezone: string;
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface TeamChannel {
  id: string;
  name: string;
  type?: string;
}

export interface TeamRouting {
  id: string;
  name: string;
  priority: number;
  isActive: boolean;
  type?: 'manual' | 'round-robin' | 'load-balanced';
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  members: string[];
  channels?: TeamChannel[];
  routing?: TeamRouting[];
  officeHours?: TeamOfficeHours;
  holidays?: { date: string; description: string }[];
}

export interface TeamChannelSelectorProps {
  selectedChatChannel?: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId?: string) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

export interface TeamIconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
}

export interface TeamMembersSelectorProps {
  teammates: {
    id: string;
    name: string;
    email: string;
  }[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

export interface TeamRoutingSelectorProps {
  selectedType: 'manual' | 'round-robin' | 'load-balanced';
  onTypeSelect: (type: 'manual' | 'round-robin' | 'load-balanced') => void;
  limits?: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  onLimitsChange?: (limits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => void;
}

export interface TeamHolidaySelectorProps {
  holidays: { date: string; description: string }[];
  onHolidayAdd: (holiday: { date: string; description: string }) => void;
  onHolidayRemove: (index: number) => void;
}

export interface TeamOfficeHoursSelectorProps {
  officeHours: {
    days: string[];
    startTime: string;
    endTime: string;
    timezone: string;
    monday?: TimeSlot[];
    tuesday?: TimeSlot[];
    wednesday?: TimeSlot[];
    thursday?: TimeSlot[];
    friday?: TimeSlot[];
    saturday?: TimeSlot[];
    sunday?: TimeSlot[];
  };
  onOfficeHoursChange: (officeHours: TeamOfficeHours) => void;
}
