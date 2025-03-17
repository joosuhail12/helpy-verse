import { CustomObjectField } from "@/types/customObject";

export const filterFields = (fields: CustomObjectField[], searchQuery: string): CustomObjectField[] => {
  return fields.filter(field =>
    field?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field?.fieldType?.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
