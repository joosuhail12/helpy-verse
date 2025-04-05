
import { useState, useEffect } from 'react';
import type { DataCollectionField } from '@/types/chatbot';

// Mock data for available fields - in a real implementation, this would fetch from an API
const AVAILABLE_FIELDS = [
  // Contact fields
  { id: 'contact_firstname', name: 'First Name', type: 'text', object: 'contact' },
  { id: 'contact_lastname', name: 'Last Name', type: 'text', object: 'contact' },
  { id: 'contact_email', name: 'Email', type: 'email', object: 'contact' },
  { id: 'contact_phone', name: 'Phone Number', type: 'phone', object: 'contact' },
  { id: 'contact_title', name: 'Job Title', type: 'text', object: 'contact' },
  { id: 'contact_timezone', name: 'Timezone', type: 'text', object: 'contact' },
  
  // Company fields
  { id: 'company_name', name: 'Company Name', type: 'text', object: 'company' },
  { id: 'company_website', name: 'Website', type: 'text', object: 'company' },
  { id: 'company_industry', name: 'Industry', type: 'text', object: 'company' },
  { id: 'company_size', name: 'Company Size', type: 'text', object: 'company' },
];

export const useCustomFields = (objectType?: string) => {
  const [fields, setFields] = useState(AVAILABLE_FIELDS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch fields from the backend
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call in a real implementation
        // const response = await api.getCustomFields();
        // setFields(response.data);
        
        // Mock async behavior
        setTimeout(() => {
          setFields(AVAILABLE_FIELDS);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load custom fields');
        setIsLoading(false);
        console.error('Error loading custom fields:', err);
      }
    };

    fetchFields();
  }, []);

  const getFieldsByObject = (objectType: string) => {
    return fields.filter(field => field.object === objectType);
  };

  // Return data in the format expected by components
  return {
    data: {
      contacts: objectType === 'contacts' ? fields.filter(field => field.object === 'contact') : [],
      companies: objectType === 'companies' ? fields.filter(field => field.object === 'company') : [],
      tickets: objectType === 'tickets' ? fields.filter(field => field.object === 'ticket') : []
    },
    isLoading,
    error,
    getFieldsByObject
  };
};
