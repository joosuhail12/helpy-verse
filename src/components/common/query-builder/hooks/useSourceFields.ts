
import { useState, useEffect } from 'react';
import { QueryField } from '@/types/queryBuilder';

/**
 * Custom hook to filter fields by source
 * @param fields The complete list of fields
 * @param source The source to filter by ('contacts', 'companies', etc)
 * @param customObject Optional custom object identifier
 */
export const useSourceFields = (
  fields: QueryField[],
  source: string,
  customObject?: string
) => {
  const [filteredFields, setFilteredFields] = useState<QueryField[]>([]);

  useEffect(() => {
    // Filter fields by source and custom object (if applicable)
    const filtered = fields.filter(field => {
      if (field.dataSource && field.dataSource !== source) {
        return false;
      }
      if (customObject && field.customObject && field.customObject !== customObject) {
        return false;
      }
      return true;
    });

    setFilteredFields(filtered);
  }, [fields, source, customObject]);

  return filteredFields;
};
