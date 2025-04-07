
import { useState, useEffect } from 'react';
import type { CustomField } from '@/types/customField';

// Mock data for available fields - in a real implementation, this would fetch from an API
const AVAILABLE_FIELDS = [
  // Contact fields
  { id: 'contact_firstname', name: 'First Name', type: 'text', object: 'contact', options: [] },
  { id: 'contact_lastname', name: 'Last Name', type: 'text', object: 'contact', options: [] },
  { id: 'contact_email', name: 'Email', type: 'email', object: 'contact', options: [] },
  { id: 'contact_phone', name: 'Phone Number', type: 'phone', object: 'contact', options: [] },
  { id: 'contact_title', name: 'Job Title', type: 'text', object: 'contact', options: [] },
  { id: 'contact_timezone', name: 'Timezone', type: 'text', object: 'contact', options: [] },
  
  // Company fields
  { id: 'company_name', name: 'Company Name', type: 'text', object: 'company', options: [] },
  { id: 'company_website', name: 'Website', type: 'text', object: 'company', options: [] },
  { id: 'company_industry', name: 'Industry', type: 'text', object: 'company', options: [] },
  { id: 'company_size', name: 'Company Size', type: 'text', object: 'company', options: [] },
];

// Add required fields to make compatible with CustomField type
const enrichFieldsWithDefaults = (fields: any[]) => {
  return fields.map(field => ({
    ...field,
    required: false,
    description: field.description || '',
    createdAt: field.createdAt || new Date().toISOString(),
    updatedAt: field.updatedAt || new Date().toISOString(),
    history: field.history || [],
  }));
};

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
      contacts: objectType === 'contacts' ? enrichFieldsWithDefaults(fields.filter(field => field.object === 'contact')) : [],
      companies: objectType === 'companies' ? enrichFieldsWithDefaults(fields.filter(field => field.object === 'company')) : [],
      tickets: objectType === 'tickets' ? enrichFieldsWithDefaults(fields.filter(field => field.object === 'ticket')) : []
    },
    isLoading,
    error,
    getFieldsByObject
  };
};
