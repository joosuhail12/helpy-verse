
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
  type: string;
  isActive: boolean;
}

export interface TeamRouting {
  id: string;
  name: string;
  priority: number;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  icon: string;
  members: string[];
  status: 'active' | 'inactive';
  type: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  channels?: TeamChannel[];
  routing?: TeamRouting[];
  officeHours?: TeamOfficeHours;
  holidays?: string[];
}

export interface TeamOfficeHoursSelectorProps {
  officeHours: { [key in DayOfWeek]: TimeSlot[] };
  onOfficeHoursChange: (hours: { [key in DayOfWeek]: TimeSlot[] }) => void;
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
  teammates: { id: string; name: string; email: string; avatar: string; role: string; status: string; }[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

export interface TeamChannelSelectorProps {
  selectedChatChannel: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId: string) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

export interface TeamRoutingSelectorProps {
  selectedType: 'manual' | 'round-robin' | 'load-balanced';
  onTypeSelect: (type: 'manual' | 'round-robin' | 'load-balanced') => void;
  limits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  onLimitsChange: (limits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => void;
}
