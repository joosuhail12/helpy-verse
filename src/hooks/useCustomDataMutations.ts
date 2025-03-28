
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CustomField } from '@/types/customField';

// These would normally interact with your Node.js backend
const addCustomFieldApi = async ({ table, field }: { 
  table: string; 
  field: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>; 
}) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: Math.random().toString(),
    ...field,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updateCustomFieldApi = async ({ 
  table, 
  fieldId, 
  updates 
}: { 
  table: string; 
  fieldId: string; 
  updates: Partial<CustomField>; 
}) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { ...updates, id: fieldId };
};

const deleteCustomFieldApi = async ({ 
  table, 
  fieldId 
}: { 
  table: string; 
  fieldId: string; 
}) => {
  // Simulating API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

export const useCustomDataMutations = () => {
  const queryClient = useQueryClient();

  const addCustomField = useMutation({
    mutationFn: addCustomFieldApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] });
    },
  });

  const updateCustomField = useMutation({
    mutationFn: updateCustomFieldApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] });
    },
  });

  const deleteCustomField = useMutation({
    mutationFn: deleteCustomFieldApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields'] });
    },
  });

  return {
    addCustomField: addCustomField.mutateAsync,
    updateCustomField: updateCustomField.mutateAsync,
    deleteCustomField: deleteCustomField.mutateAsync,
    isLoading: addCustomField.isPending || updateCustomField.isPending || deleteCustomField.isPending,
  };
};
