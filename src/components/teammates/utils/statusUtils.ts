
import type { Teammate } from '@/types/teammate';

export const getStatusDescription = (status: Teammate['status']) => {
  return status === 'active' 
    ? 'Currently active and can access the system' 
    : 'Account is deactivated';
};
