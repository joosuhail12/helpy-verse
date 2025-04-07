
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
          ...customObject.fields.map(field => {
            // Check if field has options and handle them properly
            const options = field.type === 'select' || field.type === 'multi-select' 
              ? (field.options && Array.isArray(field.options)
                ? field.options.map(opt => {
                    if (typeof opt === 'string') {
                      return { label: opt, value: opt };
                    } else if (typeof opt === 'object' && opt !== null) {
                      return { 
                        label: (opt as any).label || String(opt), 
                        value: (opt as any).value || String(opt) 
                      };
                    }
                    return { label: String(opt), value: String(opt) };
                  })
                : [])
              : undefined;

            return {
              id: `${customObject.slug}_${field.id}`,
              label: field.name,
              type: mapFieldType(field.type),
              source: 'custom_objects' as DataSource,
              customObject: slug,
              options
            };
          })
        );
      }
    } else if (selectedSource) {
      selectedFields = fields.filter(field => field.source === selectedSource);
      
      const customFields = mockCustomFields[selectedSource as keyof typeof mockCustomFields] || [];
      selectedFields.push(
        ...customFields.map(field => {
          // Check if field has options and is of the right type before processing
          const hasOptions = field.type === 'select' || field.type === 'multi-select';
          const options = hasOptions && field.options && Array.isArray(field.options)
            ? field.options.map(opt => ({ label: String(opt), value: String(opt) }))
            : undefined;

          return {
            id: `custom_${field.id}`,
            label: field.name,
            type: mapFieldType(field.type),
            source: selectedSource as DataSource,
            options
          };
        })
      );
    }

    return selectedFields.sort((a, b) => a.label.localeCompare(b.label));
  }, [fields, selectedSource]);

  return sourceFields;
};
