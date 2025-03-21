
import type { Teammate } from '@/types/teammate';

export const getRoleBadgeVariant = (role: Teammate['role']) => {
  switch (role) {
    case 'admin':
      return 'default';
    case 'supervisor':
      return 'secondary';
    case 'agent':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const getRoleDescription = (role: Teammate['role']) => {
  switch (role) {
    case 'admin':
      return 'Full access to all features and settings';
    case 'supervisor':
      return 'Can manage team members and view reports';
    case 'agent':
      return 'Can handle tickets and chat with customers';
    case 'viewer':
      return 'Can only view tickets and reports';
    default:
      return '';
  }
};
