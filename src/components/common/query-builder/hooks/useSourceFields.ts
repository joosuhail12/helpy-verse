
import { useState, useEffect } from 'react';
import type { QueryField, DataSource } from '@/types/queryBuilder';

type ExtendedDataSource = DataSource | `custom_objects.${string}` | '';

export const useSourceFields = (source: ExtendedDataSource, allFields: QueryField[]) => {
  const [fields, setFields] = useState<QueryField[]>([]);

  useEffect(() => {
    if (!source) {
      setFields([]);
      return;
    }

    // Handle custom objects source
    if (source.startsWith('custom_objects.')) {
      const customObjectName = source.split('.')[1];
      const filteredFields = allFields.filter(
        (field) => field.dataSource === 'custom_objects' && field.customObject === customObjectName
      );
      setFields(filteredFields);
      return;
    }

    // Regular data sources
    const filteredFields = allFields.filter(
      (field) => field.dataSource === source
    );
    setFields(filteredFields);
  }, [source, allFields]);

  return fields;
};
