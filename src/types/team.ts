
export interface Team {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'inactive' | 'pending';
  type?: string;
  description?: string;
  memberCount: number;
  members: TeamMember[];
  officeHours: {
    monday?: TimeSlot[];
    tuesday?: TimeSlot[];
    wednesday?: TimeSlot[];
    thursday?: TimeSlot[];
    friday?: TimeSlot[];
    saturday?: TimeSlot[];
    sunday?: TimeSlot[];
    timezone?: string;
  };
  channels: TeamChannel[];
  routing?: TeamRouting[];
  holidays: Holiday[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
}

export interface TeamChannel {
  id: string;
  name: string;
  type: 'chat' | 'email';
}

export interface TeamRouting {
  type: 'round-robin' | 'manual' | 'load-balanced';
  limits?: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
}

export interface TimeSlot {
  start: string;
  end: string;
}

// Update DayOfWeek to be an enum instead of string literals
export enum DayOfWeek {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday'
}

export interface Holiday {
  date: string;
  name: string;
}
