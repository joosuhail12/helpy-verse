
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomField } from '@/types/customField';
import { mockCustomFields } from '@/mock/customFields';

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const useFieldCache = (table: 'tickets' | 'contacts' | 'companies') => {
  const queryClient = useQueryClient();

  // Main query for fetching fields
  const query = useQuery({
    queryKey: ['customFields', table],
    queryFn: async () => {
      // This would normally fetch from your Node.js backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockCustomFields[table];
    },
    staleTime: CACHE_TIME,
  });

  // Mutation for updating a field
  const updateField = useMutation({
    mutationFn: async (updatedField: CustomField) => {
      // This would normally update through your Node.js backend
      await new Promise(resolve => setTimeout(resolve, 500));
      return updatedField;
    },
    onMutate: async (newField) => {
      await queryClient.cancelQueries({ queryKey: ['customFields', table] });
      const previousFields = queryClient.getQueryData(['customFields', table]);
      
      queryClient.setQueryData(['customFields', table], (old: CustomField[] = []) => {
        return old.map(field => field.id === newField.id ? newField : field);
      });
      
      return { previousFields };
    },
    onError: (err, newField, context: any) => {
      queryClient.setQueryData(['customFields', table], context.previousFields);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customFields', table] });
    },
  });

  return {
    fields: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    updateField: updateField.mutate,
    isUpdating: updateField.isPending,
  };
};
