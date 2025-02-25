
import type { FieldType } from '@/types/queryBuilder';

export const mapFieldType = (type: string): FieldType => {
  switch (type.toLowerCase()) {
    case 'text':
    case 'string':
    case 'rich-text':
    case 'url':
    case 'description':
      return 'text';
    case 'number':
    case 'currency':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
    case 'datetime':
      return 'date';
    case 'select':
    case 'dropdown':
      return 'select';
    case 'multi-select':
    case 'multiple':
      return 'multi-select';
    default:
      return 'text';
  }
};
