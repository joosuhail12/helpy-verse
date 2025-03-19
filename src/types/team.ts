
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: string;
}

export interface TeamOfficeHours {
  days: string[];
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface TeamChannel {
  id: string;
  type: string;
  name: string;
  isActive: boolean;
}

export interface TeamRouting {
  id: string;
  method: string;
  isActive: boolean;
}

export interface TeamHoliday {
  id: string;
  name: string;
  date: string;
  isRecurring: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  icon: string;
  status: 'active' | 'inactive';
  type: 'support' | 'sales' | 'engineering' | 'custom';
  memberCount: number;
  lead?: TeamMember;
  officeHours: TeamOfficeHours;
  channels: TeamChannel[];
  routing: TeamRouting[];
  holidays: TeamHoliday[];
}
