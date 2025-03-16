
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomField } from '@/types/customData';
import { customDataService } from '@/api/services/customData.service';

// These would normally interact with your Node.js backend
const addCustomFieldApi = async ({ table, field }: {
  table: string;
  field: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>;
}) => {
  const body = {
    name: field.name,
    entityType: table as "ticket" | "customer" | "company",
    fieldType: field.fieldType,
    placeholder: field.placeholder || null,
    defaultValue: field.defaultValue || null,
    isRequired: field.isRequired,
    options: field.options,
    description: field.description || null
  }

  const response = await customDataService.createCustomData(body);

  return response.data;
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
  const body = {
    name: updates.name,
    entityType: table as "ticket" | "customer" | "company",
    fieldType: updates.fieldType,
    placeholder: updates.placeholder || null,
    defaultValue: updates.defaultValue || null,
    isRequired: updates.isRequired,
    options: updates.options,
    description: updates.description || null
  }

  const response = await customDataService.updateCustomData(body, fieldId);

  return response.data;
};

const deleteCustomFieldApi = async ({
  table,
  fieldId
}: {
  table: string;
  fieldId: string;
}) => {
  const response = await customDataService.deleteCustomData(fieldId);

  return response.data;
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
