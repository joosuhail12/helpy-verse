
import { type Teammate } from '@/types/teammate';

export const getRoleBadgeVariant = (role?: Teammate['role']) => {
  switch (role) {
    case 'admin':
      return 'default';
    case 'supervisor':
      return 'secondary';
    case 'agent':
      return 'outline';
    case 'viewer':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getRoleDisplayName = (role?: Teammate['role']) => {
  if (!role) return 'Not Assigned';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const getRoleDescription = (role?: Teammate['role']) => {
  switch (role) {
    case 'admin':
      return 'Full access to all settings and data';
    case 'supervisor':
      return 'Can manage teams and view all data';
    case 'agent':
      return 'Can handle tickets and interact with customers';
    case 'viewer':
      return 'Read-only access to data';
    default:
      return 'Role permissions not defined';
  }
};
