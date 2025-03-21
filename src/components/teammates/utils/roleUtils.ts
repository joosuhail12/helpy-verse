
import type { Teammate } from '@/types/teammate';

export const getRoleBadgeVariant = (role: Teammate['role']) => {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ORGANIZATION_ADMIN':
      return 'default';
    case 'WORKSPACE_ADMIN':
      return 'secondary';
    case 'WORKSPACE_AGENT':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const getRoleDescription = (role: Teammate['role']) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Full access to all features and settings across organizations';
    case 'ORGANIZATION_ADMIN':
      return 'Full access to all features and settings within the organization';
    case 'WORKSPACE_ADMIN':
      return 'Can manage team members and view reports within workspace';
    case 'WORKSPACE_AGENT':
      return 'Can handle tickets and chat with customers';
    default:
      return '';
  }
};
