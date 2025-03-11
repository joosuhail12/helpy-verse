
import { CustomField } from "@/types/customData";

export const getDuplicateFields = (fields: CustomField[]): string[] => {
  const fieldNames = fields.map(f => f.name.toLowerCase());
  return fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
};

export const filterFields = (fields: CustomField[], searchQuery: string): CustomField[] => {
  return fields.filter(field =>
    field?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field?.fieldType?.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
