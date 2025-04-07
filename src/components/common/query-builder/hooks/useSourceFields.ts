
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
            // Determine if this field type should have options
            const isOptionType = field.type === 'select' || field.type === 'multi-select';
            
            // Create options array only if the field has options property and is of the right type
            let options;
            if (isOptionType) {
              // Safely access options, which may not exist on the field type
              const fieldOptions = (field as any).options;
              
              if (fieldOptions && Array.isArray(fieldOptions)) {
                options = fieldOptions.map(opt => {
                  if (typeof opt === 'string') {
                    return { label: opt, value: opt };
                  } else if (typeof opt === 'object' && opt !== null) {
                    return { 
                      label: (opt as any).label || String(opt), 
                      value: (opt as any).value || String(opt) 
                    };
                  }
                  return { label: String(opt), value: String(opt) };
                });
              }
            }

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
          // Determine if this field type should have options
          const isOptionType = field.type === 'select' || field.type === 'multi-select';
          
          // Create options only if needed and if they exist
          let options;
          if (isOptionType && field.options && Array.isArray(field.options)) {
            options = field.options.map(opt => ({ label: String(opt), value: String(opt) }));
          }

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
