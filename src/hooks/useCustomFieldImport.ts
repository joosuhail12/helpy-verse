
import * as React from 'react';
import { useCustomDataMutations } from "./useCustomDataMutations";
import type { CustomField } from "@/types/customField";

export const useCustomFieldImport = () => {
  const { addCustomField } = useCustomDataMutations();

  const handleImport = React.useCallback(async (importedFields: CustomField[], table: 'tickets' | 'contacts' | 'companies') => {
    const timestamp = new Date().toISOString();
    // Add each imported field using the existing mutation
    for (const field of importedFields) {
      await addCustomField({
        table,
        field: {
          name: field.name,
          type: field.type,
          required: field.required,
          description: field.description,
          options: field.options,
          validationRules: field.validationRules,
          dependencies: field.dependencies,
          history: [{
            id: Math.random().toString(),
            timestamp,
            userId: 'system',
            userName: 'System Import',
            action: 'created',
            changes: []
          }]
        }
      });
    }
  }, [addCustomField]);

  return { handleImport };
};
