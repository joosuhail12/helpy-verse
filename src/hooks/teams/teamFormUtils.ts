
import type { Team, DayOfWeek } from '@/types/team';

export const extractTeamMemberIds = (team: Team): string[] => {
  if (team.teamMembers && Array.isArray(team.teamMembers) && team.teamMembers.length > 0) {
    return team.teamMembers.map(member => member.id);
  } else if (team.members && Array.isArray(team.members) && team.members.length > 0) {
    return team.members;
  }
  return [];
};

export const extractChannelData = (team: Team): { 
  chatChannel: string | undefined; 
  emailChannels: string[] 
} => {
  if (team.channels) {
    return {
      chatChannel: team.channels.chat,
      emailChannels: Array.isArray(team.channels.email) ? team.channels.email : []
    };
  }
  return { chatChannel: undefined, emailChannels: [] };
};

export const extractRoutingData = (team: Team): {
  routingType: 'manual' | 'round-robin' | 'load-balanced';
  routingLimits: {
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }
} => {
  const routingType = team.routingStrategy as 'manual' | 'round-robin' | 'load-balanced';
  
  // Set routing limits
  const routingLimits = routingType === 'load-balanced' ? {
    maxTotalTickets: team.maxTotalTickets,
    maxOpenTickets: team.maxOpenTickets,
    maxActiveChats: team.maxActiveChats
  } : {};
  
  return { routingType, routingLimits };
};

export const extractOfficeHours = (team: Team): { [key in DayOfWeek]: TimeSlot[] } => {
  // Create a copy of the default structure
  const safeOfficeHours = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  };
  
  if (team.officeHours) {
    // Merge with actual data, ensuring each day has a valid array
    Object.keys(safeOfficeHours).forEach(day => {
      safeOfficeHours[day as DayOfWeek] = Array.isArray(team.officeHours?.[day as DayOfWeek]) 
        ? team.officeHours[day as DayOfWeek] 
        : [];
    });
  }
  
  return safeOfficeHours;
};

export const extractHolidays = (team: Team): string[] => {
  return team.holidays && Array.isArray(team.holidays) ? team.holidays : [];
};

export const prepareTeamDataForSubmission = (
  teamName: string,
  selectedIcon: string,
  selectedTeammates: string[],
  selectedChatChannel: string | undefined,
  selectedEmailChannels: string[],
  routingType: 'manual' | 'round-robin' | 'load-balanced',
  routingLimits: {
    maxTotalTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  },
  officeHours: { [key in DayOfWeek]: TimeSlot[] },
  selectedHolidays: string[]
) => {
  return {
    name: teamName,
    icon: selectedIcon,
    members: selectedTeammates,
    channels: {
      chat: selectedChatChannel,
      email: selectedEmailChannels,
    },
    routingStrategy: routingType,
    ...(routingType === 'load-balanced' && {
      maxTotalTickets: routingLimits.maxTotalTickets,
      maxOpenTickets: routingLimits.maxOpenTickets,
      maxActiveChats: routingLimits.maxActiveChats
    }),
    officeHours,
    holidays: selectedHolidays,
  };
};
