
import { useMemo } from 'react';
import type { QueryField, DataSource, FieldType } from '@/types/queryBuilder';
import { mockCustomObjects } from '@/mock/customObjects';
import { mockCustomFields } from '@/mock/customFields';
import { mapFieldType } from '../utils/fieldTypeMapping';

type ExtendedDataSource = DataSource | `custom_objects.${string}` | '';

export const useSourceFields = (selectedSource: ExtendedDataSource, fields: QueryField[]) => {
  const sourceFields = useMemo(() => {
    let selectedFields: QueryField[] = [];
    
    if (selectedSource?.startsWith('custom_objects.')) {
      const slug = selectedSource.split('.')[1];
      selectedFields = fields.filter(field => field.source === 'custom_objects' && field.customObject === slug);
      
      const customObject = mockCustomObjects.find(obj => obj.slug === slug);
      if (customObject) {
        selectedFields.push(
          ...customObject.fields.map(field => ({
            id: `${customObject.slug}_${field.id}`,
            label: field.name,
            type: mapFieldType(field.type),
            source: 'custom_objects' as DataSource,
            customObject: slug,
            options: field.type === 'select' || field.type === 'multi-select' 
              ? field.options?.map(opt => ({ label: opt, value: opt }))
              : undefined
          }))
        );
      }
    } else if (selectedSource) {
      selectedFields = fields.filter(field => field.source === selectedSource);
      
      const customFields = mockCustomFields[selectedSource as keyof typeof mockCustomFields] || [];
      selectedFields.push(
        ...customFields.map(field => ({
          id: `custom_${field.id}`,
          label: field.name,
          type: mapFieldType(field.type),
          source: selectedSource as DataSource,
          options: field.type === 'select' || field.type === 'multi-select'
            ? field.options?.map(opt => ({ label: opt, value: opt }))
            : undefined
        }))
      );
    }

    return selectedFields.sort((a, b) => a.label.localeCompare(b.label));
  }, [fields, selectedSource]);

  return sourceFields;
};
