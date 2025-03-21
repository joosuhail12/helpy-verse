
import { useCustomDataMutations } from "./useCustomDataMutations";
import type { CustomField } from "@/types/customData";

export const useCustomFieldImport = () => {
  const { addCustomField } = useCustomDataMutations();

  const handleImport = async (importedFields: CustomField[], table: 'ticket' | 'contact' | 'company') => {
    const timestamp = new Date().toISOString();
    // Add each imported field using the existing mutation
    for (const field of importedFields) {
      await addCustomField({
        table,
        field: {
          name: field.name,
          fieldType: field.fieldType,
          isRequired: field.isRequired,
          description: field.description || null,
          options: field.options || null,
          placeholder: field.placeholder || null,
          defaultValue: field.defaultValue || null,
          entityType: table === 'contact' ? 'customer' : table as any
        }
      });
    }
  };

  return { handleImport };
};
