
import type { Teammate } from '@/types/teammate';

export const getRoleBadgeVariant = (role?: Teammate['role']) => {
  if (!role) return 'outline';
  
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ORGANIZATION_ADMIN':
      return 'destructive';
    case 'WORKSPACE_ADMIN':
      return 'default';
    case 'WORKSPACE_AGENT':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const getRoleDescription = (role?: Teammate['role']) => {
  if (!role) return 'Standard user with basic access privileges';
  
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Full access to all system features and settings';
    case 'ORGANIZATION_ADMIN':
      return 'Administrative access across the entire organization';
    case 'WORKSPACE_ADMIN':
      return 'Administrative access within this workspace';
    case 'WORKSPACE_AGENT':
      return 'Standard user with basic access privileges';
    default:
      return 'Standard user with basic access privileges';
  }
};

export const getRoleDisplayName = (role?: Teammate['role']) => {
  if (!role) return 'Agent';
  
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'ORGANIZATION_ADMIN':
      return 'Org Admin';
    case 'WORKSPACE_ADMIN':
      return 'Admin';
    case 'WORKSPACE_AGENT':
      return 'Agent';
    default:
      return 'Agent';
  }
};
