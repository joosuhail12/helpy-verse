
import type { FieldType } from '@/types/queryBuilder';

export const mapFieldType = (type: string): FieldType => {
  switch (type.toLowerCase()) {
    case 'text':
    case 'string':
    case 'rich-text':
    case 'url':
    case 'description':
    case 'tel':
    case 'phone':
    case 'email':
      return 'text';
    case 'number':
    case 'currency':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
    case 'datetime':
    case 'timestamp':
      return 'date';
    case 'select':
    case 'dropdown':
    case 'enum':
      return 'select';
    case 'multi-select':
    case 'multiple':
    case 'tags':
    case 'array':
      return 'multi-select';
    default:
      return 'text';
  }
};
