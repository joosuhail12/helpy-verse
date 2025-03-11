
import { useQuery } from '@tanstack/react-query';
import { CustomField } from '@/types/customData';
import { customDataService } from '@/api/services/customData.service';

const fetchCustomFields = async (table: string): Promise<CustomField[]> => {
  const response = await customDataService.getAllCustomData(table);

  return response;
};

export const useCustomFields = (table: 'ticket' | 'customer' | 'company') => {
  return useQuery({
    queryKey: ['customFields', table],
    queryFn: () => fetchCustomFields(table),
  });
};
