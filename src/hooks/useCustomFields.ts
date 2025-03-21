
import { useQuery } from '@tanstack/react-query';
import { CustomField } from '@/types/customData';
import { customDataService } from '@/api/services/customData.service';

// Convert from contact to customer for API
const mapEntityType = (type: 'ticket' | 'contact' | 'company'): 'ticket' | 'customer' | 'company' => {
  if (type === 'contact') return 'customer';
  return type;
};

const fetchCustomFields = async (table: 'ticket' | 'contact' | 'company'): Promise<CustomField[]> => {
  const mappedType = mapEntityType(table);
  const response = await customDataService.getAllCustomData(mappedType);
  return response || [];
};

export const useCustomFields = (table: 'ticket' | 'contact' | 'company') => {
  return useQuery({
    queryKey: ['customFields', table],
    queryFn: () => fetchCustomFields(table),
  });
};
