
export interface TeamMember {
  id: string;
  name: string;
  email: string;
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
  channels?: {
    id: string;
    name: string;
    type: string;
    isActive: boolean;
  }[];
  routing?: {
    id: string;
    name: string;
    priority: number;
    isActive: boolean;
  }[];
  officeHours?: {
    days: string[];
    startTime: string;
    endTime: string;
    timezone: string;
  };
  holidays?: {
    id: string;
    name: string;
    date: string;
    isRecurring: boolean;
  }[];
}
