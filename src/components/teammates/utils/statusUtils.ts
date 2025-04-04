
import { type Teammate } from '@/types/teammate';

export const getStatusDescription = (status: Teammate['status']) => {
  switch (status) {
    case 'active':
      return 'User has full access to their account';
    case 'inactive':
      return 'User account is disabled';
    case 'pending':
      return 'User has been invited but has not yet accepted';
    default:
      return 'Unknown status';
  }
};
