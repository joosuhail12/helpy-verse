
export type UserStatus = 
  | 'available'
  | 'active-conversation'
  | 'busy'
  | 'break'
  | 'inactive'
  | 'offline';

export const statusConfig: Record<UserStatus, { label: string; color: string }> = {
  'available': { label: 'Available', color: 'bg-green-500' },
  'active-conversation': { label: 'Active Customer Conversation', color: 'bg-blue-500' },
  'busy': { label: 'Busy', color: 'bg-red-500' },
  'break': { label: 'Break', color: 'bg-yellow-500' },
  'inactive': { label: 'Inactive', color: 'bg-gray-500' },
  'offline': { label: 'Offline', color: 'bg-slate-500' }
};
