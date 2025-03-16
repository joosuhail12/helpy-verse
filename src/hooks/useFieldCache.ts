
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customDataService } from '@/api/services/customData.service';
import { CustomField } from '@/types/customData';
import { mockCustomFields } from '@/mock/customFields';

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const useFieldCache = (table: 'ticket' | 'customer' | 'company') => {
  const queryClient = useQueryClient();

  // Main query for fetching fields
  const query = useQuery({
    queryKey: ['customFields', table],
    queryFn: async () => {
      return await customDataService.getAllCustomData(table);
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
