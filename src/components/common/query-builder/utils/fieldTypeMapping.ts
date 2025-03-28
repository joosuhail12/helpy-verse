
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
      return 'text' as FieldType;
    case 'number':
    case 'currency':
      return 'number' as FieldType;
    case 'boolean':
      return 'boolean' as FieldType;
    case 'date':
    case 'datetime':
    case 'timestamp':
      return 'date' as FieldType;
    case 'select':
    case 'dropdown':
    case 'enum':
      return 'select' as FieldType;
    case 'multi-select':
    case 'multiple':
    case 'tags':
    case 'array':
      return 'multi-select' as FieldType;
    default:
      return 'text' as FieldType;
  }
};
