
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
}

export interface TeamHoliday {
  id: string;
  name: string;
  date: string;
  isRecurring: boolean;
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
  color: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  
  // Additional properties
  channels?: TeamChannel[];
  routing?: TeamRouting[];
  officeHours?: {
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
  holidays?: TeamHoliday[];
}

// Props interfaces
export interface TeamChannelSelectorProps {
  channels: TeamChannel[];
  onChannelsChange: (channels: TeamChannel[]) => void;
}

export interface TeamRoutingSelectorProps {
  routing: TeamRouting[];
  onRoutingChange: (routing: TeamRouting[]) => void;
}

export interface TeamOfficeHoursSelectorProps {
  officeHours: { [key in DayOfWeek]: TimeSlot[] };
  onOfficeHoursChange: (hours: { [key in DayOfWeek]: TimeSlot[] }) => void;
}

export interface TeamHolidaySelectorProps {
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}

export interface TeamMembersSelectorProps {
  selectedMembers: string[];
  onMembersChange: (members: string[]) => void;
}

export interface TeamIconPickerProps {
  selectedIcon: string;
  onIconChange: (icon: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}
