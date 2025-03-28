
import { useQuery } from '@tanstack/react-query';
import { mockCustomFields } from '@/mock/customFields';
import type { CustomFields } from '@/types/customField';

// This would normally fetch from your Node.js backend
const fetchCustomFields = async (): Promise<CustomFields> => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockCustomFields;
};

export const useCustomFields = (table: 'tickets' | 'contacts' | 'companies') => {
  return useQuery({
    queryKey: ['customFields', table],
    queryFn: fetchCustomFields,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
