
import { useState, useEffect } from 'react';
import { HttpClient } from '@/api/services/http';

interface CustomField {
  id: string;
  name: string;
  type: string;
  options?: string[];
  required: boolean;
  description?: string;
}

interface UseCustomFieldsResult {
  fields: CustomField[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCustomFields = (objectType?: string): UseCustomFieldsResult => {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          description: 'Ticket priority level'
        },
        { 
          id: 'custom_field_2', 
          name: 'Category', 
          type: 'select', 
          options: ['Bug', 'Feature Request', 'Question', 'Support'],
          required: true, 
          description: 'Issue category'
        },
        { 
          id: 'custom_field_3', 
          name: 'Expected Resolution Date', 
          type: 'date', 
          required: false,
          description: 'When the issue is expected to be resolved'
        },
      ];
      
      // Filter by object type if provided
      const filteredFields = objectType 
        ? mockFields.filter(f => f.id.startsWith(objectType)) 
        : mockFields;
      
      setFields(filteredFields);
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

  return { fields, loading, error, refetch };
};
