
import { useState, useEffect } from 'react';
import { HttpClient } from '@/api/services/http';
import { CustomField } from '@/types/customField';

interface CustomFieldsData {
  tickets?: CustomField[];
  contacts?: CustomField[];
  companies?: CustomField[];
  fields?: CustomField[];
  [key: string]: CustomField[] | undefined;
}

interface UseCustomFieldsResult {
  fields: CustomField[];
  data: CustomFieldsData;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCustomFields = (objectType?: string): UseCustomFieldsResult => {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CustomFieldsData>({
    tickets: [],
    contacts: [],
    companies: [],
    fields: []
  });

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, we'd fetch from API with proper endpoint
      // For now we're mocking some data
      const mockFields: CustomField[] = [
        { 
          id: 'custom_field_1', 
          name: 'Priority', 
          type: 'select', 
          options: ['High', 'Medium', 'Low'],
          required: true, 
          description: 'Ticket priority level',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [],
          visible: true
        },
        { 
          id: 'custom_field_2', 
          name: 'Category', 
          type: 'select', 
          options: ['Bug', 'Feature Request', 'Question', 'Support'],
          required: true, 
          description: 'Issue category',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [],
          visible: true
        },
        { 
          id: 'custom_field_3', 
          name: 'Expected Resolution Date', 
          type: 'date', 
          required: false,
          description: 'When the issue is expected to be resolved',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          history: [],
          visible: true
        },
      ];
      
      // Filter by object type if provided
      const filteredFields = objectType 
        ? mockFields.filter(f => f.id.startsWith(objectType)) 
        : mockFields;
      
      setFields(filteredFields);
      
      // Structure the data object based on field types
      const newData: CustomFieldsData = {
        tickets: [],
        contacts: [],
        companies: [],
        fields: filteredFields
      };
      
      if (objectType) {
        newData[objectType] = filteredFields;
      }
      
      setData(newData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching custom fields:", err);
      setError("Failed to load custom fields");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [objectType]);

  const refetch = () => fetchFields();

  // For compatibility with components expecting isLoading
  const isLoading = loading;

  return { fields, data, loading, isLoading, error, refetch };
};
