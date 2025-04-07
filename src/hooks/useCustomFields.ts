
import { useQuery } from '@tanstack/react-query';

interface CustomField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
  object: string;
}

interface CustomFieldsResponse {
  contacts?: CustomField[];
  companies?: CustomField[];
  deals?: CustomField[];
  tickets?: CustomField[];
}

export interface UseCustomFieldsResult {
  data: CustomFieldsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Mock API function to fetch custom fields
const fetchCustomFields = async (objectType?: string): Promise<CustomFieldsResponse> => {
  // In a real implementation, this would be an API call
  // For now, we'll return mock data
  return {
    contacts: [
      { id: 'field1', name: 'Preferred Contact Time', type: 'select', required: false, options: ['Morning', 'Afternoon', 'Evening'], object: 'contact' },
      { id: 'field2', name: 'Lead Source', type: 'text', required: false, object: 'contact' },
      { id: 'field3', name: 'Birthday', type: 'date', required: false, object: 'contact' }
    ],
    companies: [
      { id: 'field4', name: 'Industry', type: 'select', required: false, options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'], object: 'company' },
      { id: 'field5', name: 'Annual Revenue', type: 'number', required: false, object: 'company' },
      { id: 'field6', name: 'Number of Employees', type: 'number', required: false, object: 'company' }
    ],
  };
};

export const useCustomFields = (objectType?: string): UseCustomFieldsResult => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['customFields', objectType],
    queryFn: () => fetchCustomFields(objectType)
  });

  return {
    data,
    isLoading,
    isError,
    error
  };
};
