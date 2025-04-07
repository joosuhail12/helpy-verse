
export type UserStatus = 'available' | 'active-conversation' | 'busy' | 'break' | 'inactive' | 'offline';

export interface StatusConfig {
  label: string;
  color: string;
}

export const statusConfig: Record<UserStatus, StatusConfig> = {
  'available': {
    label: 'Available',
    color: 'bg-green-500'
  },
  'active-conversation': {
    label: 'In Conversation',
    color: 'bg-blue-500'
  },
  'busy': {
    label: 'Busy',
    color: 'bg-yellow-500'
  },
  'break': {
    label: 'On Break',
    color: 'bg-orange-500'
  },
  'inactive': {
    label: 'Inactive',
    color: 'bg-gray-500'
  },
  'offline': {
    label: 'Offline',
    color: 'bg-red-500'
  }
};
