
export interface Team {
  id: string;
  name: string;
  icon: string;
  description?: string;
  createdAt?: string;
  members: string[];
  routingType: 'manual' | 'round-robin' | 'load-balanced';
  limits?: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  status: 'active' | 'inactive';
  officeHours?: {
    [key in DayOfWeek]?: TimeSlot[];
  };
  channels?: string[];
  holidays?: Holiday[];
  type?: string;
}

export enum DayOfWeek {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday'
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Holiday {
  date: string;
  name: string;
}

export interface TeamChannelSelectorProps {
  selectedChannels: string[];
  onChannelSelect: (channels: string[]) => void;
  selectedChatChannel?: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId: string | undefined) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

export interface TeamMembersSelectorProps {
  selectedMembers: string[];
  onMemberSelect: (members: string[]) => void;
  teammates: any[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}

export interface TeamOfficeHoursSelectorProps {
  officeHours: {
    [key in DayOfWeek]?: TimeSlot[];
  };
  onOfficeHoursChange: (officeHours: {
    [key in DayOfWeek]?: TimeSlot[];
  }) => void;
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

export interface TeamHolidaySelectorProps {
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}

export interface TeamIconPickerProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  onIconSelect?: (icon: string) => void;
}

export interface TeamBasicInfoProps {
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  selectedIcon: string;
  setSelectedIcon: React.Dispatch<React.SetStateAction<string>>;
  teammates: any[];
  selectedTeammates: string[];
  onTeammateToggle: (teammateId: string) => void;
}
